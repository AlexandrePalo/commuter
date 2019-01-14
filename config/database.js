import mongoose from 'mongoose'
import constants from './constants'

mongoose.connection.on('error', e => {
  throw e
})

export default {
  mongoose,
  connect: async test => {
    mongoose.Promise = global.Promise
    try {
      await mongoose.connect(
        test ? constants.MONGO_URL_TEST : constants.MONGO_URL,
        { useNewUrlParser: true },
        () => {
          !test && console.log('MongoDB database is running')
        }
      )
      if (test) {
        await mongoose.connection.collections['users'].drop()
      }
    } catch (err) {
      console.log(err)
    }
  },
  disconnect: done => {
    mongoose.disconnect(done)
  }
}
