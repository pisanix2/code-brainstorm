const HTTPStatus = require('http-status')

module.exports = app => {
  app.use((req, res, next) => {
    let err = new Error(HTTPStatus[HTTPStatus.NOT_FOUND])
    err.status = HTTPStatus.NOT_FOUND
    err.code = 'NOT_FOUND'
    next(err)
  })
}
