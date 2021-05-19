const productEmb = require('./ProductEmb')
const product = require('./Product')
const defsSchema = {
  $id: "http://example.com/schemas/defs.json",
  definitions: {
    ProductEmb: { type: 'object', properties: productEmb.properties },
    Product: { type: 'object', properties: product.properties }
  }
}

module.exports = defsSchema
