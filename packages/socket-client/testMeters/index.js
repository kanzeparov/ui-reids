let SerialPort = require('serialport'); // создаем переменную импортируемую как serialport

const TTY = process.env.TTY || '/home/pi/dev/em-4tm';
const rd = '03'; // константа заголовка чтения
const wr = '22'; // константа заголовка записи

let port = new SerialPort(TTY, {
  baudRate: 9600,
  parity: 'none',
  dataBits: 8,
  stopBits: 1
});

const delay = async (msec) => {
  await new Promise((r) => {
    setTimeout(() => {
      r();
    }, msec)
  })
}

async function doRead(port) {
  const crc16 = (buffer) => {
    let crc = 0xFFFF;
    buffer.forEach((byte) => {
      crc = crc ^ byte;
      for (let j = 0; j < 8; j++) {
        let odd = crc & 0x0001
        crc = crc >> 1
        if (odd) {
          crc = crc ^ 0xA001
        }
      }
    });
    let str = crc.toString(16);
    while (str.length < 4) {
      str = `0${str}`;
    }
    const checksum = Buffer.from(str, 'hex');
    return checksum.swap16();
  };

  const responses = [];
  const sendCommand = async ({ cmd, conditionEnd }) => {
    console.log('---');
    console.log(`query ${cmd}`);
    const queryStr = `${rd}${cmd.replace(/\s+/g, '')}`;
    const crc = crc16(Buffer.from(queryStr, 'hex')).toString('hex');
    const query = Buffer.from(`${queryStr}${crc}`, 'hex');
    const result = await new Promise((resolve) => {
      port.write(query, (err) => {
        if (err) {
          console.log('error', err);
        }
        console.log('write ok');
        port.on('readable', onData);
        let accumulator = Buffer.from('');
        function onData() {
          let chunk = port.read();
          if (chunk) {
            console.log(`response:`, chunk);
            console.log(`Got chunk of length ${chunk.length}`);
            accumulator = Buffer.concat([accumulator, chunk], accumulator.length + chunk.length);
            if (conditionEnd(accumulator)) {
              console.log('fully received', accumulator);
              console.log('----');
              port.removeAllListeners('readable');
              resolve(accumulator);
            }
          }
        }
      });
    });
    responses.push({
      cmd,
      response: result.toString('hex')
    })
    return result;
  }
  await sendCommand({
    cmd: '00',
    conditionEnd: buffer => buffer.length === 4
  });
  await delay(2000);
  await sendCommand({
    cmd: '01 30 30 30 30 30 30', // авторизация
    conditionEnd: buffer => buffer.length === 4
  });
  await delay(2000);
  await sendCommand({
    cmd: '08 00', // Серийный номер
    conditionEnd: buffer => buffer.length === 10
  });
  await delay(2000);
  await sendCommand({
    cmd: '08 0a', // Прочитать слово состояния счетчика
    conditionEnd: buffer => buffer.length === 8
  });
  await delay(2000);
  await sendCommand({
    cmd: '08 14 50', // Чтение времени фиксирования параметров
    conditionEnd: buffer => buffer.length === 11
  });
  await delay(2000);
  await sendCommand({
    cmd: '08 1b 03 00', // Чтение активной мощности
    conditionEnd: buffer => buffer.length === 19
  });

  await delay(2000);
  await sendCommand({
    cmd: '08 02', // Чтение коэффициентов трансформации
    conditionEnd: buffer => buffer.length === 13
  });
  return responses;
}

const start = async () => {
  const res = await new Promise((resolve) => {
    port.once('open', function (err) {
      if (err) {
        console.log('Error: ', err.message);
      } else {
        console.log('open');
        doRead(port).then(function (responses) {
          port.close(console.log('close'));
          resolve(responses);
        }).catch(function () { });
      }
    });
  });
  console.log(JSON.stringify(res, null, 2));
}

start();
