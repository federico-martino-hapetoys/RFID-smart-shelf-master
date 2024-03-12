import mongoose from 'mongoose'
const { log } = require('../../common/logger');

function DBConnection(uri) {
  let result = mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
    .catch(err => { //if there are any errors...
      log('DB Connection error:', err.stack)
      throw err
    })
    .then(() => {
      log("Connection to MongoDB successfully!")
    });
  return result
}

export default DBConnection