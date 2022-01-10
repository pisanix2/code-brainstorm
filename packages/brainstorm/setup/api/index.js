const http = require('http')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const HTTPStatus = require('http-status')
const swagger = require('../../swagger')
const errors = require('../../shared/error-hander')
const errorCatch = require('../../shared/error-catch')
const notFoundCatch = require('../../shared/not-found-catch')
const { resolveErrorDatabase } = require('../../sequelize/errors')
const { onError, onListening } = require('../../shared/entrypoint')
const { executeAction } = require('../../process/handler')
const database = require('../../sequelize/models')
const cors = require('../../shared/cors')
const fileUpload = require('express-fileupload')

cors(app)
app.use(bodyParser.json({ limit: '1024kb' }))
app.use(fileUpload())
swagger.resetFile()

const register = (actions) => {
  const router = express.Router()
  const baseUrl = ''
  for (const action of actions) {
    const verb = actionToVerb(action.action)
    const path = action.path

    router[verb](path, handlerLocal(action))
  }
  app.use(baseUrl, router)

  swagger.generate(actions)
}

const listen = (port) => {
  swagger.register(app)
  notFoundCatch(app)
  errorCatch(app)

  const server = http.createServer(app)
  server.listen(port)
  server.on('error', onError)
  server.on('listening', onListening)
}

const handlerLocal = (action) => {
  return async (req, res, next) => {
    let transaction = null
    if (action.hasTransaction) {
      transaction = await database.sequelize.transaction()
    }
    try {
      const contextInit = { ...req.params, ...req.query }
      contextInit.authorization = req.headers['authorization']
      const ret = await executeAction({ actionId: action.id, payload: req.body, context: contextInit, transaction, files: req.files })

      if (transaction) {
        await transaction.commit()
      }

      res
        .status(HTTPStatus.OK)
        .json(ret)
    } catch (error) {
      if (transaction) {
        await transaction.rollback()
      }
      if (error.original && error.original.code) {
        error = errors.buildError(resolveErrorDatabase(error.original.code), error.original.message)
      }
      if (HTTPStatus[error.code]) {
        error.status = error.code
      }
      return next(error)
    }
  }
}

const actionToVerb = (action) => {
  if (action === 'create') return 'post'
  else if (action === 'update') return 'put'
  else if (action === 'delete') return 'delete'
  else return 'get'
}

module.exports = {
  register,
  listen
}