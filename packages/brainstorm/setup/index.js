const fs = require('fs')
const processAction = require('../process')
const api = require('./api')
const rule = require('./rule')
const schema = require('./schema')

rule.loadDefault()

const registerActions = (actions) => {
  processAction.registerAction(actions)
  api.register(actions, rule)
}

const registerSchemas = (schemas) => {
  schema.register(schemas)
}

const registerRules = (rules) => {
  rule.register(rules)
}

const registerDomain = (domains) => {
  if (!Array.isArray(domains)) domains = [domains]
  for (const item of domains) {
    const rulePath = `${item}/rules`
    if (fs.existsSync(rulePath)) {
      registerRules(require(rulePath))
    }

    const ruleSchemas = `${item}/schemas`
    if (fs.existsSync(ruleSchemas)) {
      registerSchemas(require(ruleSchemas))
    }

    const ruleActions = `${item}/actions`
    if (fs.existsSync(ruleActions)) {
      registerActions(require(ruleActions))
    }
  }
}

const listen = (port) => {
  api.handlerGetSchema({ getSchemaByName: schema.getSchemaByName })
  api.listen(port)
}

module.exports = {
  registerActions,
  registerSchemas,
  registerRules,
  registerDomain,
  listen
}
