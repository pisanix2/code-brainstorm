require('dotenv').config()
const { listen, registerDomain } = require('@packages/brainstorm/setup')

registerDomain([
  `${__dirname}/domains/user`
])

//
// Listen API
//
listen(process.env.PORT)
