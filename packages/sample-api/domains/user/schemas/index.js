const User = require('./User')
const Login = require('./Login')

module.exports = [{
  name: 'User',
  persistenceName: 'user',
  schema: User
}, {
  name: 'Login',
  schema: Login
}]
