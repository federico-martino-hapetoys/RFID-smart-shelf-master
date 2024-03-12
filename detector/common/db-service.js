const SmartShelfMsg = require('./db/models/SmartShelfMsg');
const config = require('config');
const shopId = config.get("shopId")

module.exports = {
  save: async (portId, portPath, msg) => {
    const smartShelfMsg = new SmartShelfMsg({ id: Date.now(), shopId, portId, portPath, msg, sent: false })
    await smartShelfMsg.save()
  }
}
