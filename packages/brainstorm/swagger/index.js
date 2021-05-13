const swaggerUi = require('swagger-ui-express')
const swaggerJSDoc = require('swagger-jsdoc')
const generateSwagger = require('./generate')

const generate = (actions) => {
  generateSwagger.generate(actions)
}

const resetFile = () => {
  generateSwagger.resetFile()
}

const config = () => {
  const apis = [
    `${__dirname}/__cache/*.js`,
    `${__dirname}/default/*.js`
  ]
  const swaggerDefinition = {
    info: {
      title: 'API',
      version: '1.0.1',
      description: 'API'
    },
    basePath: '/'
  }

  const options = {
    swaggerDefinition: swaggerDefinition,
    apis
  }

  const swaggerSpec = swaggerJSDoc(options)

  return {
    config: (req, res, next) => {
      res.setHeader('Content-Type', 'application/json')
      res.send(swaggerSpec)
    },
    ui: swaggerUi.setup(swaggerSpec)
  }
}

const register = (app) => {
  const swaggerModule = config()
  app.get('/json', swaggerModule.config)
  app.use('/swagger', swaggerUi.serve, swaggerModule.ui)
  app.get('/', (req, res, next) => res.redirect('/swagger'))
}

module.exports = {
  generate,
  resetFile,
  register
}
