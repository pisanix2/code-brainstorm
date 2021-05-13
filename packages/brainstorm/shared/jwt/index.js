const jsonwebtoken = require('jsonwebtoken')

module.exports = {
  sign: (data) => {
    return jsonwebtoken.sign(data, process.env.JWT_SECRET_KEY, {
      expiresIn: parseInt(process.env.JWT_IAT)
    })
  },
  verify: (token) => {
    return jsonwebtoken.verify(token, process.env.JWT_SECRET_KEY)
  },
  decode: (token) => {
    return jsonwebtoken.decode(token)
  }
}
