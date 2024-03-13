const amqpService = require('./common/amqp-service')
const dispatcher = require('./common/dispatcher')
const { log } = require('./common/logger')
const config = require('config')
const { DBConnection } = require('./common/db/DBConnection')
const { SmartShelfMsg } = require('./common/db/models/SmartShelfMsg')

const conf = {
  mongoDbUri: config.get('mongoDbUri')
}

try {
  log('Get all SmartShelf Messages')

  log('Connecting to MongoDB uri', conf.mongoDbUri)

  DBConnection(conf.mongoDbUri)
    .then(() => log('Connection ok'))
    .catch((_error) => log('Connection to MongoDB failed'))

  SmartShelfMsg.find({ sent: false }, function (err, messages) {
    if (err) {
      log(err)
      throw err
    }

    log(messages)
    messages.forEach((msg) => {
      dispatcher.send(JSON.stringify(msg))
    })
  })
} catch (error) {
  log(error)
  throw error
}

amqpService.subscribeQueue(dispatcher.send)
