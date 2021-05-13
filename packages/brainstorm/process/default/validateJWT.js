const { verify, decode } = require('../../shared/jwt')

const execute = ({ payload, context, errors, database, logger }) => {
  try {
    if (context.authorization) {
      const token = context.authorization.replace('Bearer', '').trim()
      if (verify(token)) {
        context.user = decode(token)
        context.contractId = context.user.contractId
      } else {
        throw errors.buildError('401', 'token not verified')
      }
    } else {
      throw errors.buildError('401', 'authorization not found')
    }
  } catch (error) {
    throw errors.buildError('401', error.message)
  }
  return payload
}

module.exports = {
  execute
}
