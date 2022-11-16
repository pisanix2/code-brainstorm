const execute = async ({ payload, context, database, action, logger, transaction }) => {
  const model = database[action.schema]

  let order = null
  if (context.sortBy) {
    order = [[
      context.sortBy,
      (context.descending === 'true' ? 'DESC' : 'ASC')
    ]]
  }

  let limit = null
  let offset = null
  if (context.page && context.rowsPerPage) {
    context.page = parseInt(context.page)
    context.rowsPerPage = parseInt(context.rowsPerPage)
    if (context.rowsPerPage > 0) {
      limit = context.rowsPerPage

      if (context.page > 1) {
        offset = (context.page * context.rowsPerPage) - context.rowsPerPage
      }
    }
  }

  let where = null
  if (context.filter) {
    let obj = context.filter
    if (typeof obj === 'string') {
      obj = JSON.parse(decodeURIComponent(obj))
    }

    const keys = Object.keys(obj)
    for (const key of keys) {
      if (typeof obj[key] === 'object') {
        const itemKeys = Object.keys(obj[key])
        for (const itemKey of itemKeys) {
          if (database.Sequelize.Op[itemKey]) {
            const vl = obj[key][itemKey]
            delete obj[key][itemKey]
            obj[key][database.Sequelize.Op[itemKey]] = vl
          }
        }
      }
    }

    where = obj
  }

  let include = null
  if (action.include) {
    include = action.include
  }

  const options = {
    order,
    limit,
    offset,
    where,
    include
  }

  const ret = await model.findAndCountAll(options, { transaction })
  return ret
}

module.exports = {
  execute
}
