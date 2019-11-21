import 'dotenv/config'
import 'source-map-support/register'
import * as io from 'socket.io-client'
import * as moment from 'moment'
import createLogger from './log'
import meterCommands from './meterCommands'
import * as SerialPort from 'serialport'
import * as Emitter from 'events'

// @ts-ignore
global.emitter = new Emitter()
const TTY = process.env.TTY || '/home/pi/dev/em-4tm'
const log = createLogger('server')
let statusPort = false // false - опрашивается | true - свободен, не опрашивается

const SOCKET_SERVER_URL: any = process.env.SOCKET_SERVER_URL
log.debugJSON('', {
  SOCKET_SERVER_URL
})
const socket = io(SOCKET_SERVER_URL, { query: { token: process.env.SOCKET_TOKEN } })

const randomNum = (fixed: number): string => {
  const precision = 100
  const num = (Math.floor(Math.random() * (20 * precision - 1 * precision) + 1 * precision) / (1 * precision)).toFixed(fixed)
  return num
}

socket.on('connect', () => {
  log.debug('connected')
  socket.emit('portStatus', { statusPort })
  socket.emit('test', {
    ok: true,
    date: new Date().toJSON()
  })
})

interface GetCommandsData {
  address: string, // адрес заголовка чтения == адрес счетчика
  commandName: string,
  commands: { cmd: string, l: number }[]
  options?: any
}

let port = new SerialPort(TTY, {
  baudRate: 9600,
  parity: 'none',
  dataBits: 8,
  stopBits: 1
})

let timeSteps = 0
const intervalCheckPort = setInterval(() => {
  if (!statusPort) {
    timeSteps += 1
    if (timeSteps === 20) {
      statusPort = true
      socket.emit('portStatus', { statusPort })
      console.log('PORT IS FREE')
    }
  }
  // console.log(`checkPort ${moment().format('HH:mm:ss').toString()}`)
}, 250)

// port.on('open', () => {
// })
port.on('readable', () => {
  if (statusPort) {
    statusPort = false
    socket.emit('portStatus', { statusPort })
    console.log('PORT IS ACTIVE')
  }
  timeSteps = 0
  const chunk = port.read()
  // @ts-ignore
  // global.chunk = port.read()
  // @ts-ignore
  global.emitter.emit('readingPort', chunk)
})

socket.on('sendMeter', async (data: GetCommandsData) => {
  log.debugJSON('sendMeter', {
    data
  })
  const meterData: any = await meterCommands(port, data.commands, data.address)
  socket.emit('responseMeter', {
    name: data.commandName,
    result: meterData,
    // address: process.env.TTY,
    address: data.address,
    timestamp: moment().unix().toString(),
    options: data.options
  })
})
