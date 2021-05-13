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
    where = obj
  }

  const options = {
    order,
    limit,
    offset,
    where
  }

  const ret = await model.findAndCountAll(options, { transaction })
  return ret
}

module.exports = {
  execute
}
