const HTTPStatus = require('http-status')
const logger = require('../logger')({ctx: 'error-catch'})

module.exports = app => {
  app.use((err, req, res, next) => {
    res.status(err.status || HTTPStatus.INTERNAL_SERVER_ERROR)
    if (!err.code) {
      logger.error(err)
    }
    res.json(err)
  })
}
