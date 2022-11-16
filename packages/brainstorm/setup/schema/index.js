const modelImport = require('../../sequelize/model-import')
const { registerSchema } = require("../../validation")

const schemaObj = {}

const register = (schemas) => {
  for (const schema of schemas) {
    if (schemaObj[schema.name]) {
      throw new Error(`Schema ${schema.name} was exists`)
    }
    schemaObj[schema.name] = schema.schema

    if (schema.persistenceName) {
      modelImport.importSchema(schema)
    }
  }
  registerSchema(schemas)
}

const associate = () => {
  modelImport.associate()
}

const getSchemaByName = (name) => {
  return schemaObj[name]
}

const getSchemaArray = () => {
  const keys = schemaObj.keys()
  const array = []
  for (const name of keys) {
    array.push({ name: name, schema: schemaObj[name] })
  }
  return array
}

module.exports = {
  register,
  associate,
  getSchemaByName,
  getSchemaArray
}