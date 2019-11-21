import 'dotenv/config'
import 'source-map-support/register'
import * as io from 'socket.io-client'
import * as moment from 'moment'
import createLogger from './log'
import * as SerialPort from 'serialport'

const log = createLogger('checkPort')
const TTY = process.env.TTY || '/home/pi/dev/em-4tm'
let statusPort = false // false - опрашивается | true - свободен, не опрашивается

const SOCKET_SERVER_URL: any = process.env.SOCKET_SERVER_URL
log.debugJSON('', {
  SOCKET_SERVER_URL
})
const socket = io(SOCKET_SERVER_URL, { query: { token: process.env.SOCKET_TOKEN } })

socket.on('connect', () => {
  log.debug('connected')
})

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
      console.log('PORT IS FREE')
    }
  }
  console.log(`checkPort ${moment().format('HH:mm:ss').toString()}`)
}, 250)

// port.on('open', () => {
// })
port.on('readable', () => {
  statusPort = false
  timeSteps = 0
  console.log('PORT IS ACTIVE')
})
