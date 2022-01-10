const lodash = require('lodash')
const { uuid } = require('../../shared/uuid')

const execute = async ({ payload, context, database, action, logger, transaction }) => {
  const model = database[action.schema]
  if (!payload.id) {
    payload.id = uuid()
  }
  const dataCreated = await model.create(payload, { transaction })
  payload = await model.findByPk(dataCreated.id, { transaction })
  return payload
}

module.exports = {
  execute
}