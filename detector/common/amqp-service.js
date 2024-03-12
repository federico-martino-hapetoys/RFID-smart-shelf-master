const config = require('config');
const amqp = require('amqplib/callback_api');
const conf = {
  amqpUri: config.get("amqpUri"),
  queueName: config.get("queueName")
}
const { log } = require('./logger');

module.exports = {
  sendMsg: (portId, portPath, msg) => amqp.connect(conf.amqpUri, function (error0, connection) {
    if (error0) {
      log(error0)
      throw error0;
    }

    connection.createChannel(function (error1, channel) {
      if (error1) {
        log(error1)
        throw error1;
      }

      channel.assertQueue(conf.queueName, {
        durable: false
      });

      channel.sendToQueue(conf.queueName, Buffer.from(msg));
      log("Sent message", msg);
    });

    setTimeout(function () {
      console.log("Update ", JSON.parse(msg).id, "as sent")
      connection.close();
    }, 500);
  })
}