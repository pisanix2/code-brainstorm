const execute = async ({ payload, context, database, action, logger, errors }) => {
  const model = database[action.schema]
  const keys = Object.keys(context)
  for (const key of keys) {
    if (model.rawAttributes[key]) {
      payload[key] = context[key]
    }
  }
  return payload
}

module.exports = {
  execute
}