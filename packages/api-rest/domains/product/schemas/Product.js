const schema = {
  $id: 'http://example.com/schemas/product.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Product',
  type: 'object',
  properties: {
    code: { type: 'string' },
    name: { type: 'string' },
    ProductEmb: { type: 'array', items: { '$ref': 'defs.json#/definitions/ProductEmb' } }
  },
  required: ['code', 'name']
}

module.exports = schema
