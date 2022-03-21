const models = require('../models')
const fs = require('fs')

const importSchema = (schemas) => {
  if (!Array.isArray(schemas)) schemas = [schemas]
  for (const schema of schemas) {
    const modelFile = JSONSchemaToModelFile(schema)
    const model = require(modelFile)(models.sequelize, models.Sequelize.DataTypes)
    models[model.name] = model
  }
}

const typeSchemaToModel = (type, format) => {
  if (type === 'number') return 'NUMBER'
  else if (type === 'boolean') return 'BOOLEAN'
  else if (type === 'object') return 'JSONB'
  else if (type === 'array') return 'JSONB'
  else {
    if (format === 'date-time') return 'DATE'
    else return 'STRING'
  }
}

const JSONSchemaToModelFile = (schema) => {
  const head = `
  module.exports = (sequelize, DataTypes) => {
    const _model = sequelize.define('${schema.name}', {
  `

  let properties = ''
  
  const DBSchema = schema.schema.DBSchema
  const props = schema.schema.properties
  const keys = Object.keys(schema.schema.properties)
  const pk = schema.schema.primaryKey
  for (const col of keys) {
    if (['string', 'number', 'date', 'integer', 'boolean', 'object', 'array'].indexOf(props[col].type) >= 0) {
      let colStr = ''
      const colDef = props[col]
      if (!colDef.virtual) {
        const req = (schema.schema.required || []).includes(col)
        colStr = `${col}: {
        type: DataTypes.${typeSchemaToModel(props[col].type, props[col].format)}
        ${req ? ', allowNull: false' : ''}
        ${col === pk ? ', primaryKey: true' : ''}
      },
      `
      }
      properties += colStr
    }
  }

  //#TODO - Create associate
  const assosiate = `
  `

  const footer = `
    }, { paranoid: true, tableName: '${schema.persistenceName}' ${ DBSchema ? `, schema: '${DBSchema}'` : ''} })

    ${assosiate}

    return _model
  }
  `

  const path = `${__dirname}/__cache`
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
  const name = `${path}/${schema.name}.js`
  const str = `
    ${head}
    ${properties}
    ${footer}
  `
  fs.writeFileSync(name, str)
  return name
}

module.exports = {
  importSchema
}
