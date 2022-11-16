const HTTPStatus = require('http-status')
const logger = require('../logger')({ctx: 'error-catch'})

module.exports = app => {
  app.use((err, req, res, next) => {
    let code = parseInt(err.status)
    if (isNaN(code)) {
      code = HTTPStatus.INTERNAL_SERVER_ERROR
    }

    res.status(code)
    if (!err.code) {
      logger.error(err)
    }
    res.json(err)
  })
}
