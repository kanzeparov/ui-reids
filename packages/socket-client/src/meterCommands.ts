import * as SerialPort from 'serialport'
import createLogger from './log'

const log = createLogger('meterCheck')

export default async (port: SerialPort, data: any[], address: string) => {
  // const TTY = process.env.TTY || '/home/pi/dev/em-4tm'
  const rd = address // константа заголовка чтения
  // const rd = '22' // константа заголовка чтения
  // const rd = '03' // константа заголовка чтения
  // const wr = '22' // константа заголовка записи

  // let port = new SerialPort(TTY, {
  //   baudRate: 9600,
  //   parity: 'none',
  //   dataBits: 8,
  //   stopBits: 1
  // })

  const delay = async (msec: number) => {
    await new Promise((r) => {
      setTimeout(() => {
        r()
      }, msec)
    })
  }

  async function doRead(port: any) {
    const crc16 = (buffer: any) => {
      let crc = 0xFFFF
      buffer.forEach((byte: any) => {
        crc = crc ^ byte
        for (let j = 0; j < 8; j++) {
          let odd = crc & 0x0001
          crc = crc >> 1
          if (odd) {
            crc = crc ^ 0xA001
          }
        }
      })
      let str = crc.toString(16)
      while (str.length < 4) {
        str = `0${str}`
      }
      const checksum = Buffer.from(str, 'hex')
      return checksum.swap16()
    }

    const responses: any[] = []
    const sendCommand = async ({ cmd, conditionEnd }: any) => {
      console.log('---')
      console.log(`query ${cmd}`)
      const queryStr = `${rd}${cmd.replace(/\s+/g, '')}`
      const crc = crc16(Buffer.from(queryStr, 'hex')).toString('hex')
      const query = Buffer.from(`${queryStr}${crc}`, 'hex')
      const result = await new Promise((resolve) => {
        const timer = setTimeout(() => {
          clearTimeout(timer)
          resolve(false)
        }, 10000)
        port.write(query, (err: any) => {
          if (err) {
            console.log('error', err)
          }
          console.log('write ok')
          // port.on('readable', onData)
          let accumulator = Buffer.from('')
          // function onData () {
          //   let chunk = port.read()
          //   if (chunk) {
          //     const parts = chunk.toString('hex').match(/[\s\S]{2}/g) || []
          //     console.log(`response:`, parts.join(' '))
          //     console.log(`Got chunk of length ${chunk.length}`)
          //     accumulator = Buffer.concat([accumulator, chunk], accumulator.length + chunk.length)
          //     if (conditionEnd(accumulator)) {
          //       console.log('fully received', accumulator)
          //       console.log('----')
          //       // port.removeAllListeners('readable')
          //       clearTimeout(timer)
          //       resolve(accumulator)
          //     } else {
          //       resolve(false)
          //     }
          //   }
          // }
          // @ts-ignore
          global.emitter.once(`readingPort`, chunk => {
            if (chunk) {
              const parts = chunk.toString('hex').match(/[\s\S]{2}/g) || []
              console.log(`response:`, parts.join(' '))
              console.log(`Got chunk of length ${chunk.length}`)
              accumulator = Buffer.concat([accumulator, chunk], accumulator.length + chunk.length)
              if (conditionEnd(accumulator)) {
                console.log('fully received', accumulator)
                console.log('----')
                // port.removeAllListeners('readable')
                clearTimeout(timer)
                resolve(accumulator)
              } else {
                resolve(false)
              }
            }
          })
        })
      })
      if (!result) {
        throw new Error('bad response')
      }
      responses.push({
        cmd,
        // @ts-ignore
        response: result.toString('hex')
      })
      return result
    }

    const checkConnection = await sendCommand({
      cmd: '00',
      conditionEnd: (buffer: any) => buffer.length === 4
    })
    if (!checkConnection) {
      return {
        error: true
      }
    }
    // @ts-ignore
    // crc16(Buffer.from(queryStr, 'hex')).toString('hex')
    // if (checkConnection.toString('hex') !== '03000140') {
    if (checkConnection.toString('hex') !== `${rd}00` + crc16(Buffer.from(`${rd}00`, 'hex')).toString('hex')) {
      log.error('no connection meter')
      return {
        error: true
      }
    }
    await delay(2000)
    await sendCommand({
      cmd: '01 30 30 30 30 30 30', // авторизация
      conditionEnd: (buffer: any) => buffer.length === 4
    })

    for (let task of data) {
      await delay(2000)
      await sendCommand({
        cmd: task.cmd,
        conditionEnd: (buffer: any) => buffer.length === task.l
      })
    }

    log.info('reading meter ok')
    return {
      error: false,
      responses
    }
  }

  const res = await new Promise((resolve) => {
    // port.once('open', function (err: any) {
    //   if (err) {
    //     console.log('Error: ', err.message)
    //   } else {
    //     console.log('open')
    //     doRead(port).then(function (responses) {
    //       port.close()
    //       console.log('close')
    //       resolve(responses)
    //     }).catch((err) => {
    //       log.error(err)
    //       port.close()
    //       console.log('close')
    //       resolve({
    //         error: true
    //       })
    //     })
    //   }
    // })
    doRead(port).then(function (responses) {
      // port.close()
      // console.log('close')
      resolve(responses)
    }).catch((err) => {
      log.error(err)
      // port.close()
      // console.log('close')
      resolve({
        error: true
      })
    })
  })
  return res
}
