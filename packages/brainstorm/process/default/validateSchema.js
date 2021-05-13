const { validate, getErrors } = require('../../validation')

const execute = ({ payload, context, database, action, logger, errors }) => {
  const valid = validate(action.schema, payload)
  if (valid) {
    return payload
  } else {
    const error = errors.getErrorInstance()
    const detail = getErrors(action.schema)
    for (const det of detail) {
      const field = det.params.missingProperty
      const code = `${det.keyword}/${field}`
      const message = det.message
      error.addError(code, message)
    }
    throw error
  }
}

module.exports = {
  execute
}