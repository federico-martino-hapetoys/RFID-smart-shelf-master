import express from 'express'
import DBConnection from './db/DBConnection'
import smartShelfMsgRouter from './routers/smartShelfMsg'
const config = require('config');
const { log } = require('../common/logger');
const conf = {
  mongoDbUri: config.get("mongoDbUri"),
  wsAddress: config.get("wsAddress"),
  wsPort: config.get("wsPort"),
}

log(`Connecting to MongoDB uri`, conf.mongoDbUri)
DBConnection(conf.mongoDbUri)
  .then(() => log('Connection ok'))
  .catch(error => log('Connection to MongoDB failed'))

// Init Express Framework
var app = express()
// Enable support for JSON-encoded bodies
app.use(express.json())
// Enable support for URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Enable SmartShelf service
app.use('/smartShelfMsg', smartShelfMsgRouter)

// Start Express Server
app.listen(conf.wsPort, conf.wsAddress, () => {
  log("Server is running on port", conf.wsPort)
})