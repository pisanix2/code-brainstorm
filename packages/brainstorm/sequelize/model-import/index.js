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

const associate = () => {
  Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
      models[modelName].associate(models)
    }
  })
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

const parseRef = (ref) => {
  const obj = ref.split('/')
  return obj[obj.length-1]
}

const JSONSchemaToModelFile = (schema) => {
  const head = `
  module.exports = (sequelize, DataTypes) => {
    const _model = sequelize.define('${schema.name}', {
  `

  let properties = ''
  
  const ass = []
  const DBSchema = schema.schema.DBSchema
  const props = schema.schema.properties
  const keys = Object.keys(schema.schema.properties)
  const pk = schema.schema.primaryKey
  for (const col of keys) {
    if (['string', 'number', 'date', 'integer', 'boolean', 'object', 'array'].indexOf(props[col].type) >= 0) {
      let colStr = ''
      const colDef = props[col]
      
      if ((!colDef.virtual) && (!(colDef.items && colDef.items['$ref']))) {
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
    if (props[col]['$ref']) {
      ass.push({ kind: 'hasOne', ref: parseRef(props[col]['$ref']), as: props[col].as, foreignKey: props[col].foreignKey })
    }
    if (props[col].type === 'array' && props[col].items['$ref']) {
      const through = props[col].items.through
      const kind = through ? 'belongsToMany' : 'hasMany'
      ass.push({ kind, ref: parseRef(props[col].items['$ref']), as: props[col].items.as, foreignKey: props[col].items.foreignKey, through })
    }
  }
  if (schema && schema.schema && schema.schema.belongsTo) {
    for (const blto of schema.schema.belongsTo) {
      ass.push({ kind: 'belongsTo', ref: blto.ref, as: blto.as, foreignKey: blto.foreignKey })
    }
  }

  let assosiate = ''
  if (ass && ass.length) {
    assosiate += '_model.associate = function (models) { '
    for (const itemAs of ass) {
      assosiate += `
          models.${schema.name}.${itemAs.kind}(models.${itemAs.ref}, { as: '${itemAs.as}', foreignKey: '${itemAs.foreignKey}' ${
            itemAs.through ? `, through: '${itemAs.through}'`: ''
          } })
        `
    }
    assosiate += '}'
  }

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
  importSchema,
  associate
}
