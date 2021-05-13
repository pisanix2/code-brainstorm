const execute = async ({ payload, context, database, action, logger, errors, transaction }) => {
  const model = database[action.schema]
  const id = context.id

  const fetchData = await model.findByPk(id, { transaction })
  if (!fetchData) throw errors.buildError('404', 'Record not found')

  return fetchData
}

module.exports = {
  execute
}