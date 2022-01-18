const create = require('./create')
const update = require('./update')
const del = require('./delete')
const read = require('./read')
const readById = require('./readById')
const validateJWT = require('./validateJWT')
const validateSchema = require('./validateSchema')
const contextToPayload = require('./contextToPayload')
const contextToFilter = require('./contextToFilter')

module.exports = [{
  name: 'create',
  rule: create
}, {
  name: 'update',
  rule: update
}, {
  name: 'delete',
  rule: del
}, {
  name: 'read',
  rule: read
}, {
  name: 'readById',
  rule: readById
}, {
  name: 'validateJWT',
  rule: validateJWT
}, {
  name: 'validateSchema',
  rule: validateSchema
}, {
  name: 'contextToPayload',
  rule: contextToPayload
}, {
  name: 'contextToFilter',
  rule: contextToFilter
}]
