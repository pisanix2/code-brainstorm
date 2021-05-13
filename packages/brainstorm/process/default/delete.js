const execute = async ({ payload, context, database, action, errors, logger, transaction }) => {
  const model = database[action.schema]
  const id = context.id

  const fetchData = await model.findByPk(id)
  if (!fetchData) throw errors.buildError('404', 'Record not found')

  return await fetchData.destroy({ transaction })
}

module.exports = {
  execute
}