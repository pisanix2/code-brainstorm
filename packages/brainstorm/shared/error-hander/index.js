const CustomError = require('./CustomError')
const logger = require('../logger')({ctx: 'error-handler'})

const errors = {
  getErrorInstance() {
    return new CustomError()
  },

  buildError(code, message, options) {
    options = options || { reQueue: true }
    let error = errors.getErrorInstance()
    error.addError(code, message)
    error.reQueue = options.reQueue
    logger.error(`${code} ${message}`)
    return error
  }
}

module.exports = errors
