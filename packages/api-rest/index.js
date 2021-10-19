require('dotenv').config()
const { listen, registerDomain } = require('@pisanix/brainstorm/setup')

registerDomain([
  `${__dirname}/domains/user`
])

//
// Listen API
//
listen(process.env.PORT)
