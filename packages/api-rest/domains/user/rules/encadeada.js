const { executeAction } = require('@packages/brainstorm/process/handler')

const execute = async ({ payload, params, database, action, logger, errors, context, transaction }) => {
  console.log('Login realizado!')
  const data = await executeAction({ actionId: 'user-read', context, transaction })
  return data
}

module.exports = {
  execute
}
