const postgresError = require('./postgres')

module.exports = {
  resolveErrorDatabase: code => {
    return postgresError[code] ? postgresError[code] : null
  }
}
