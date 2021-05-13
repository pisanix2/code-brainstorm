const { ruleDefault, register, getByName } = require('../../process')

const loadDefault = () => {
  register(ruleDefault)
}

module.exports = {
  register,
  getByName,
  loadDefault
}
