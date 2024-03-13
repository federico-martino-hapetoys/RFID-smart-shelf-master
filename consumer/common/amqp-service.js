const config = require('config')
const amqp = require('amqplib/callback_api')
const conf = {
  shopId: config.get('shopId'),
  amqpUri: config.get('amqpUri'),
  queueName: config.get('queueName')
}
const { log } = require('./logger')

module.exports = {
  sendMsg: (shopId, portId, portPath, msg) => amqp.connect(conf.amqpUri, function (error0, connection) {
    if (error0) {
      log(error0)
      throw error0
    }

    connection.createChannel(function (error1, channel) {
      if (error1) {
        log(error1)
        throw error1
      }

      channel.assertQueue(conf.queueName, {
        durable: false
      })

      channel.sendToQueue(conf.queueName, Buffer.from(JSON.stringify({ shopId, portId, portPath, msg })))
      log('Sent message', msg)
    })

    setTimeout(function () {
      connection.close()
      process.exit(0)
    }, 500)
  }),

  subscribeQueue: (callback) => amqp.connect(conf.amqpUri, function (error0, connection) {
    if (error0) {
      log(error0)
      throw error0
    }

    connection.createChannel(function (error1, channel) {
      if (error1) {
        log(error1)
        throw error1
      }

      channel.assertQueue(conf.queueName, {
        durable: false
      })

      log('Waiting for messages in queue', conf.queueName, 'Press CTRL+C to exit')

      channel.consume(conf.queueName, function (msg) {
        log('Received message', msg.content.toString())

        callback(msg.content.toString())
      }, {
        noAck: true
      })
    })
  })
}
