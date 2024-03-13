import mongoose from 'mongoose'

const smartShelfMsg = mongoose.Schema({
  id: {
    type: Number,
    required: true,
    trim: true
  },
  shopId: {
    type: String,
    required: true
  },
  portId: {
    type: String,
    required: true
  },
  portPath: {
    type: String,
    required: true
  },
  msg: {
    type: String,
    required: true,
    trim: true
  },
  received: {
    type: Date,
    default: Date.now
  }
})

const SmartShelMsg = mongoose.model('SmartShelfMsg', smartShelfMsg)

export default SmartShelMsg
