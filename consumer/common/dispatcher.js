const config = require('config');
const http = require('http');
const { log } = require('./logger');

const conf = {
  remoteApiUrl: config.get("remoteApiUrl"),
}

module.exports = {
  send: (msg) => {
    let ws = new URL(conf.remoteApiUrl);
    let post_options = {
      host: ws.hostname,
      port: ws.port,
      path: ws.pathname,
      protocol: ws.protocol,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    try {
      let req = http.request(post_options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
          log('Response: ' + chunk);
        });
      });
      req.write(msg);
      req.end();
    } catch (e) {
      log(e)
    }
  }
}