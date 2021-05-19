const schema = {
  $id: 'http://example.com/schemas/product.emb.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'ProductEmb',
  type: 'object',
  properties: {
    productId: { '$ref': 'defs.json#/definitions/Product' },
    unid: { type: 'string' },
    price: { type: 'number' }
  },
  required: ['unid', 'price']
}

module.exports = schema
