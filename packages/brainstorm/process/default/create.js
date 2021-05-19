const lodash = require('lodash')
const { uuid } = require('../../shared/uuid')

const execute = async ({ payload, context, database, action, logger, transaction }) => {
  const model = database[action.schema]
  context[`original${action.schema}`] = lodash.cloneDeep(payload)
  if (!payload.id) {
    payload.id = uuid()
  }

  let include = []
  if (context.relations) {
    let obj = context.relations
    if (typeof obj === 'string') {
      obj = JSON.parse(decodeURIComponent(obj))
    }
    if (!Array.isArray(obj)) obj = [obj]

    for (const item of obj) {
      const model = database[item]
      if (model) {
        include.push({ model, as: item })
      }
    }
  }

  const dataCreated = await model.create(payload, { transaction, include })
  payload = await model.findByPk(dataCreated.id, { transaction, include })
  return payload
}

module.exports = {
  execute
}