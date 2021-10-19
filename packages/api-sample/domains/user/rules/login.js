const { sign } = require('@pisanix/brainstorm/shared/jwt')

const execute = async ({ payload, params, database, action, logger, errors, context, transaction }) => {
  //  if (context.authorization) {
  //    const basicToken = context.authorization.replace('Basic ', '')
  //    const strToken = Buffer.from(basicToken, 'base64').toString('ascii')
  //    const objToken = strToken.split(':')

  //    const data = await database.User.findAll({ where: { login: objToken[0], password: objToken[1] } })
  const data = await database.User.findAll({ where: { login: payload.login, password: payload.password } })

  if (data && data.length) {
    const objUser = data[0].dataValues
    delete objUser.password
    const jwt = sign(objUser)
    return { access_token: jwt, type: 'Bearer' }
  } else {
    throw errors.buildError('401')
  }
  //  } else {
  //    throw errors.buildError('401', 'Authorization not found')
  //  }
}

module.exports = {
  execute
}
