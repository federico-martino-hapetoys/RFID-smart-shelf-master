const config = require('config')
const http = require('http')
const { log } = require('./logger')

const conf = {
  remoteApiUrl: config.get('remoteApiUrl')
}

module.exports = {
  send: (msg) => {
    const ws = new URL(conf.remoteApiUrl)
    const postOptions = {
      host: ws.hostname,
      port: ws.port,
      path: ws.pathname,
      protocol: ws.protocol,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    try {
      const req = http.request(postOptions, function (res) {
        res.setEncoding('utf8')
        res.on('data', function (chunk) {
          log('Response: ' + chunk)
        })
      })
      req.write(msg)
      req.end()
    } catch (e) {
      log(e)
    }
  }
}
