const Ajv = require('ajv')
const ajv = new Ajv({ allErrors: true, removeAdditional:'all' })
const compiled = {}
const schemaStr = {}

const registerSchema = (schemas) => {
  for (const schema of schemas) {
    if (compiled[schema.name]) {
      throw new Error(`Schema ${schema.name} was exists`)
    }
    if (schema && schema.schema && schema.schema.primaryKey) {
      delete schema.schema.primaryKey
    }
    schemaStr[schema.name] = schema.schema
    compiled[schema.name] = ajv.compile(schema.schema)
  }
}

const validate = (schemaName, payload) => {
  return compiled[schemaName](payload)
}

const getErrors = (schemaName) => {
  const errors = compiled[schemaName].errors
  return errors
}

const getSchemaStr = (name) => {
  return schemaStr[name]
}

module.exports = {
  registerSchema,
  getErrors,
  getSchemaStr,
  validate
}