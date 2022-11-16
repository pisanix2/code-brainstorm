const fs = require('fs');
const YAML = require('json-to-pretty-yaml');
const schema = require('../setup/schema')
const pathCache = `${__dirname}/__cache`
const path = `${pathCache}/api-definition.js`

const checkPropRef = (schemaObj) => {
  const newSchema = { ...schemaObj }
  delete newSchema.belongsTo
  delete newSchema.primaryKey
  if (newSchema && newSchema.properties) {
    for (const item of Object.keys(newSchema.properties)) {
      const selProp = newSchema.properties[item]
      if (selProp['$ref']) {
        newSchema.properties[item] = { '$ref': `#${selProp['$ref']}` }
      }
      if (selProp.type === 'array') {
        newSchema.properties[item] = {
          type: selProp.type,
          items: {
            '$ref': `#${selProp.items['$ref']}` 
          }
        }
      }
    }
  }
  return newSchema
}

const createJson = (actions) => {
  const jsonObj = { definitions: {} }
  for (const item of actions) {
    const verb = actionToVerb(item.action)
    const has404 = true
    const hasJWT = (item.rules.filter(el => el === 'validateJWT')).length
    const hasValid = (item.rules.filter(el => el === 'validateSchema')).length
    const hasRead = (item.rules.filter(el => el === 'read')).length
    const docs = item.docs || {}
    const objAct = {}

    const objParams = []
    const tmpUrl = item.path
    docs.params = docs.params || {}

    const splitedUrl = item.path.split('/')
    for (const item of splitedUrl) {
      if (item.indexOf(':') >= 0) {
        const paramName = item.replace(':', '')
        if (!docs.params[paramName]) {
          docs.params[paramName] = {
            description: paramName,
            type: 'string'
          }
        }
      }
    }

    const localParam = Object.keys(docs.params)
    for (const item of localParam) {
      const docParam = docs.params[item]
      const type = (tmpUrl.indexOf(`:${item}`) >= 0) ? 'path' : 'query'
      objParams.push({
        in: type,
        name: item,
        description: docParam.description,
        type: docParam.type || 'string',
        format: docParam.format || null
      })
    }

    if (hasRead) {
      objParams.push({
        in: 'query',
        name: 'sortBy',
        description: 'Campo que irá ordenar os registros retornados',
        type: 'string'
      })
      objParams.push({
        in: 'query',
        name: 'descending',
        description: 'A ordenação será decrescente?',
        type: 'boolean'
      })
      objParams.push({
        in: 'query',
        name: 'page',
        description: 'Página de dados que será retornada',
        type: 'integer'
      })
      objParams.push({
        in: 'query',
        name: 'rowsPerPage',
        description: 'Tamanho de registros na página',
        type: 'integer'
      })
      objParams.push({
        in: 'query',
        name: 'filter',
        description: 'Estrutura e pesquisa baseado no where do sequelize, deve conter um objeto JSON com encodeURL',
        type: 'string'
      })
    }

    if (hasValid) {
      const schemaObj = schema.getSchemaByName(item.schema)
      if (schemaObj) {
        objParams.push({
          in: 'body',
          name: 'body',
          type: 'object',
          schema: {
            '$ref': `#/definitions/${item.schema}`
          }
        })
      }
    }

    /* registrar a definição do esquema */
    if (docs.outputSchema) {
      const schemaObj = schema.getSchemaByName(docs.outputSchema)
      if (schemaObj) {
        if (!hasRead) {
          if (!jsonObj.definitions[docs.outputSchema]) {
            jsonObj.definitions[docs.outputSchema] = checkPropRef(schemaObj)
          }
        }
      }
    }

    if (item.schema) {
      const schemaObj = schema.getSchemaByName(item.schema)
      if (schemaObj) {
        if (!jsonObj.definitions[item.schema]) {
          jsonObj.definitions[item.schema] = checkPropRef(schemaObj)
        }
      }
    }
    /** */

    let objBody = {
      '$ref': `#/definitions/${docs.outputSchema}`
    }
    if (hasRead) {
      objBody = {
        properties: {
          count: { type: 'integer' },
          rows: { type: 'array', items: { '$ref': `#/definitions/${docs.outputSchema}` } }
        }
      }
    }

    const obj200 = {
      '200': {
        description: 'OK',
        schema: objBody
      }
    }

    const obj400 = {
      '400': {
        description: 'Bad request',
        schema: {
          '$ref': '#/definitions/Error'
        }
      }
    }

    const obj401 = (!hasJWT) ? null : {
      '401': {
        description: 'Unauthorized'
      }
    }

    const obj404 = (!has404) ? null : {
      '404': {
        description: 'Not found'
      }
    }

    objAct[verb] = {
      summary: docs.summary,
      tags: docs.tags || [item.schema],
      consumes: ['application/json'],
      produces: ['application/json'],
      security: hasJWT ? [{ 'Bearer': [] }] : null,
      parameters: objParams,
      responses: {
        ...obj200,
        ...obj400,
        ...obj401,
        ...obj404
      }
    }
    const url = item.path.split('/').reduce((acm, el) => {
      if (el.indexOf(':') >= 0) {
        el = `{${el.replace(':', '')}}`
      }
      return `${acm}/${el}`
    })

    jsonObj[url] = jsonObj[url] || {}
    jsonObj[url] = { ...objAct, ...jsonObj[url] }
  }
  return jsonObj
}

const actionToVerb = (action) => {
  if (action === 'create') return 'post'
  else if (action === 'update') return 'put'
  else if (action === 'delete') return 'delete'
  else return 'get'
}

const generate = (actions) => {
  const objJson = createJson(actions)
  let strYml = YAML.stringify(objJson)
  strYml = strYml.replace(/\n/g, '\n * ').trimEnd()
  const data = `/**\n * @swagger\n * ${strYml}/\n`

  if (!fs.existsSync(pathCache)) {
    fs.mkdirSync(pathCache)
  }
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, '', (err) => {})
  }
  fs.appendFileSync(path, data, (err) => {
    if (err) return console.log(err)
  })
}

const resetFile = () => {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path)
  }
}

module.exports = { 
  generate,
  resetFile
}
