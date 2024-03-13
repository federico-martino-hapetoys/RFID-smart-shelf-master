const config = require('config')
const amqpService = require('./common/amqp-service')
const dbService = require('./common/db-service')
const SerialPort = require('serialport').SerialPort
const { log } = require('./common/logger')
const DBConnection = require('./common/db/DBConnection')
const HID = require('node-hid')
HID.setDriverType('hidraw')
// const hidDevices = HID.devices()

const conf = {
  mongoDbUri: config.get('mongoDbUri'),
  shopId: config.get('shopId'),
  serialPorts: config.get('serialPorts'),
  usbPorts: config.get('usbPorts'),
  hidPorts: config.get('hidPorts')
}

const monitoredPorts = []
log('Connecting to MongoDB uri', conf.mongoDbUri)
DBConnection(conf.mongoDbUri)
  .then(() => log('Connection ok'))
  .catch(error => log('Connection to MongoDB failed', error))

// For each configured serial ports, monitor messages
conf.serialPorts.forEach(sP => {
  log('Serial Port detected: ', sP.id, sP.port)

  monitoredPorts.push({
    id: sP.id,
    port: new SerialPort({ baudRate: 9600, path: sP.port, ...sP.options }).on('data', function (msg) {
      // If the received message is useful, parse and write to the queue
      dbService.save(sP.id, sP.port, msg)
      amqpService.sendMsg(sP.id, sP.port, msg)
    })
  })
})

// For each configured serial ports, monitor messages
conf.usbPorts.forEach(sP => {
  log('USB Port detected: ', sP.id, sP.port)

  monitoredPorts.push({
    id: sP.id,
    port: new SerialPort({ baudRate: 9600, path: sP.port, ...sP.options }).on('data', function (msg) {
      // If the received message is useful, parse and write to the queue
      dbService.save(sP.id, sP.port, msg)
      amqpService.sendMsg(sP.id, sP.port, msg)
    })
  })
})

// For each configured serial ports, monitor messages
conf.hidPorts.forEach(hP => {
  log('HID Port detected: ', hP.id, hP.port)
  const device = new HID.HID(hP.port)

  monitoredPorts.push({
    id: hP.id,
    port: device.on('data', function (data) {
      const buf = Buffer.from(data)
      // If the received message is useful, parse and write to the queue
      dbService.save(hP.id, hP.port, buf.toString())
      amqpService.sendMsg(hP.id, hP.port, JSON.stringify({ id: Date.now(), shopId: conf.shopId, portId: hP.id, portPath: hP.port, msg: buf.toString(), sent: false }))
    })
  })
})
