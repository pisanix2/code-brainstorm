const execute = async ({ payload, context, database, action, logger, errors }) => {
  const model = database[action.schema]
  const keys = Object.keys(context)
  const filter = {}
  for (const key of keys) {
    if (model.rawAttributes[key]) {
      filter[key] = context[key]
    }
  }
  if (context.filter && typeof context.filter === 'string') {
    context.filter = JSON.parse(decodeURIComponent(context.filter))
  }
  context.filter = { ...filter, ...(context.filter || {}) }
  return payload
}

module.exports = {
  execute
}