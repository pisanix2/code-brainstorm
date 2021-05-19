const def = require('./defs')
const Product = require('./Product')
const ProductEmb = require('./ProductEmb')

module.exports = [{
  name: 'def',
  schema: def
}, {
  name: 'Product',
  persistenceName: 'product',
  schema: Product
}, {
  name: 'ProductEmb',
  persistenceName: 'product_emb',
  schema: ProductEmb
}]
