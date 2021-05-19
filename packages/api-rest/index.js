require('dotenv').config()
const { listen, registerDomain } = require('@packages/brainstorm/setup')

registerDomain([
  `${__dirname}/domains/user`,
  `${__dirname}/domains/product`
])

//
// Listen API
//
listen(process.env.PORT)
