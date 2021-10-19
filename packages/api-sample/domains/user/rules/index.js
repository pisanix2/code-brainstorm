const encadeada = require('./encadeada')
const login = require('./login')

module.exports = [{
  name: '@user/encadeada',
  rule: encadeada
}, {
  name: '@user/login',
  rule: login
}]