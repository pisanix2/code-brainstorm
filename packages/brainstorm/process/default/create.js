const lodash = require('lodash')
const { uuid } = require('../../shared/uuid')

const execute = async ({ payload, context, database, action, logger, transaction }) => {
  const model = database[action.schema]
  context[`original${action.schema}`] = lodash.cloneDeep(payload)
  if (!payload.id) {
    payload.id = uuid()
  }
  if (context.user) {
    if (model.rawAttributes.contractId && (!payload.contractId)) {
      payload.contractId = context.user.contractId
    }
  }
  const dataCreated = await model.create(payload, { transaction })
  payload = await model.findByPk(dataCreated.id, { transaction })
  return payload
}

module.exports = {
  execute
}