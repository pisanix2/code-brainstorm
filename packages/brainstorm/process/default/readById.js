const execute = async ({ payload, context, database, action, logger, errors, transaction }) => {
  const model = database[action.schema]
  const id = context.id

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

  const fetchData = await model.findByPk(id, { transaction, include })
  if (!fetchData) throw errors.buildError('404', 'Record not found')

  return fetchData
}

module.exports = {
  execute
}