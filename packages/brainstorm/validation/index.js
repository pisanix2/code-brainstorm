const Ajv = require('ajv')
const addFormats = require('ajv-formats').default
const compiled = {}
const schemaStr = {}

const registerSchema = (schemas) => {
  const schemaArray = []
  const cacheName = {}
  for (const schema of schemas) {
    if (cacheName[schema.name]) {
      throw new Error(`Schema ${schema.name} was exists`)
    }
    cacheName[schema.name] = true
    schemaArray.push(schema.schema)
  }
  const ajv = new Ajv({ allErrors: true, removeAdditional:'all', strict: false, schemas: schemaArray })
  addFormats(ajv)
  for (const schema of schemas) {
    schemaStr[schema.name] = schema.schema
    compiled[schema.name] = ajv.getSchema(schema.schema['$id'])
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