const errors = require('../../shared/error-hander')
const logger = require('../../shared/logger')
const database = require('../../sequelize/models')
const processAction = require('../index')

const executeAction = async ({ actionId, payload, context, transaction, files }) => {
  context = context || {}
  const { action } = processAction.getActionById(actionId)

  for (const rule of action.rules) {
    const { execute } = processAction.getByName(rule)
    const obj = { payload, files, context, database, action, errors, transaction, logger: logger({ ctx: actionId }) }
    payload = await execute(obj)
  }
  return payload
}

module.exports = {
  executeAction
}
