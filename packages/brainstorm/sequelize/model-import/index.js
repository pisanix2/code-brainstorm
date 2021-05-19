const models = require('../models')
const fs = require('fs')
let modelArray = []

const importSchema = (schemas, schemaCollection) => {
  if (!Array.isArray(schemas)) schemas = [schemas]
  modelArray = schemaCollection
  for (const schema of schemas) {
    const modelFile = JSONSchemaToModelFile(schema)
    const model = require(modelFile)(models.sequelize, models.Sequelize.DataTypes)
    models[model.name] = model
  }
}

const typeSchemaToModel = (type, format) => {
  if (type === 'number') return 'DOUBLE'
  else if (type === 'boolean') return 'BOOLEAN'
  else if (type === 'object') return 'JSONB'
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
  let assosiate = ''

  const props = schema.schema.properties
  const keys = Object.keys(schema.schema.properties)
  const pk = schema.schema.primaryKey
  for (const col of keys) {
    const colDef = props[col]
    if (['string', 'number', 'date', 'integer', 'boolean', 'object'].indexOf(colDef.type) >= 0) {
      let colStr = ''
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

    if (['array'].indexOf(colDef.type) >= 0 && colDef.items && colDef.items['$ref']) {
      const ref = colDef.items['$ref'].replace('defs.json#/definitions/', '')
      const destModel = modelArray.filter(el => el.name === ref)
      if (destModel && destModel.length) {
        const propDest = destModel[0].schema.properties
        const propKeys = Object.keys(propDest)
        let destName = null
        for (const propItem of propKeys) {
          if (propDest[propItem]['$ref']) {
            const tmpName = propDest[propItem]['$ref'].replace('defs.json#/definitions/', '')
            if (tmpName === schema.name) {
              destName = propItem
              break
            }
          }
        }

        assosiate += `  models.${schema.name}.hasMany(models.${ref}, {as: '${ref}', foreignKey: '${destName}'})
        `
      }
    }

    if ((!colDef.type) && colDef['$ref']) {
      const ref = colDef['$ref'].replace('defs.json#/definitions/', '')
      assosiate += `  models.${schema.name}.belongsTo(models.${ref}, {as: '${ref}', foreignKey: '${col}'})
        `
    }
  }

  const footer = `
    }, { paranoid: true, tableName: '${schema.persistenceName}' })

    _model.associate = function (models) {
    ${assosiate}
    }

    return _model
  }
  `

  const name = `${__dirname}/__cache/${schema.name}.js`
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