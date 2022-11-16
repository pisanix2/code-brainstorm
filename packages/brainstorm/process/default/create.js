const lodash = require('lodash')
const { uuid } = require('../../shared/uuid')

const execute = async ({ payload, context, database, action, logger, transaction }) => {
  const model = database[action.schema]
  context[`original${action.schema}`] = lodash.cloneDeep(payload)
  if (!payload.id) {
    payload.id = uuid()
  }

  const createOptions = { transaction }
  if (action.include) {
    createOptions.include = action.include
  }
  const dataCreated = await model.create(payload, createOptions)
  payload = await model.findByPk(dataCreated.id, { transaction })
  return payload
}

module.exports = {
  execute
}