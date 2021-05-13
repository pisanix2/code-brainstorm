const { v4: uuidv4 } = require('uuid')

const uuid = () => {
  return uuidv4().replace(/-/g, '')
}

module.exports = {
  uuid
}
