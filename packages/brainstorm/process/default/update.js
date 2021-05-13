const lodash = require('lodash')

const execute = async ({ payload, context, database, action, logger, errors, transaction }) => {
  const model = database[action.schema]
  const id = context.id
  context[`original${action.schema}`] = lodash.cloneDeep(payload)

  const fetchData = await model.findByPk(id, { transaction })
  if (!fetchData) throw errors.buildError('404', 'Record not found')

  return await fetchData.update(payload, { transaction })
}

module.exports = {
  execute
}