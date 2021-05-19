const fs = require('fs');
const YAML = require('json-to-pretty-yaml');
const schema = require('../setup/schema')
const path = `${__dirname}/__cache/api-definition.js`
const modelCache = {}

const createJson = (actions) => {
  const jsonObj = {}
  for (const item of actions) {
    const verb = actionToVerb(item.action)
    const has404 = true
    const hasJWT = (item.rules.filter(el => el === 'validateJWT')).length
    const hasValid = (item.rules.filter(el => el === 'validateSchema')).length
    const hasRead = (item.rules.filter(el => el === 'read')).length
    const docs = item.docs || {}
    const objAct = {}

    const objParams = []
    const tmpUrl = item.path.split('/')
    for (const param of tmpUrl) {
      if (param.indexOf(':') >= 0) {
        const paramName = param.replace(':', '')
        docs.params = docs.params || {}
        const docParam = docs.params[paramName] || {}
        objParams.push({
          in: 'path',
          name: paramName,
          description: docParam.description,
          type: docParam.type || 'string'
        })
      }
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
        if (modelCache[item.schema]) {

        } else {
          modelCache[item.schema] = {}
          modelCache[item.schema].properties = schemaObj.properties
        }

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

    let schemaResp200 = null
    if (docs.outputSchema) {
      const schemaObj = schema.getSchemaByName(docs.outputSchema)
      if (schemaObj) {
        if (modelCache[docs.outputSchema]) {

        } else {
          modelCache[docs.outputSchema] = {}
          modelCache[docs.outputSchema].properties = schemaObj.properties
        }
        let propertiesLocal = {
          schema: {
            '$ref': `#/definitions/${docs.outputSchema}`
          }
        }
        if (hasRead) {
          propertiesLocal = {
            schema: {
              properties: {
                count: { type: 'integer' },
                rows: {
                  type: 'array',
                  '$ref': `#/definitions/${docs.outputSchema}`
                }
              }
            }
          }
        }
        schemaResp200 = propertiesLocal
      }
    }

    const obj200 = {
      '200': {
        description: 'OK',
        ...schemaResp200
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
  jsonObj.definitions = modelCache
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

  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, '', (err) => { })
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
