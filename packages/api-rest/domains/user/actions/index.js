const { ACTION_TYPE, RULE_DEFAULT } = require('@packages/brainstorm/shared/enums')

module.exports = [{
  id: 'user-read-by-id',
  action: ACTION_TYPE.readById,
  path: '/user/:id',
  schema: 'User',
  rules: [RULE_DEFAULT.validateJWT, RULE_DEFAULT.readById],
  docs: {
    summary: 'teste doc api',
    tags: ['User'],
    outputSchema: 'User',
    params: {
      'id': { description: 'ID do registro', type: 'string' }
    }
  }
}, {
  id: 'user-read',
  action: ACTION_TYPE.read,
  path: '/user',
  schema: 'User',
  rules: [RULE_DEFAULT.validateJWT, RULE_DEFAULT.read],
  docs: {
    outputSchema: 'User'
  }
}, {
  id: 'user-create',
  action: ACTION_TYPE.create,
  path: '/user',
  schema: 'User',
  rules: [RULE_DEFAULT.validateJWT, RULE_DEFAULT.validateSchema, RULE_DEFAULT.create],
  docs: {
    outputSchema: 'User'
  }
}, {
  id: 'user-update-by-id',
  action: ACTION_TYPE.update,
  path: '/user/:id',
  schema: 'User',
  rules: [RULE_DEFAULT.validateJWT, RULE_DEFAULT.validateSchema, RULE_DEFAULT.update],
  docs: {
    outputSchema: 'User'
  }
}, {
  id: 'user-delete-by-id',
  action: ACTION_TYPE.delete,
  path: '/user/:id',
  schema: 'User',
  rules: [RULE_DEFAULT.validateJWT, RULE_DEFAULT.delete],
  hasTransaction: true,
  docs: {
    outputSchema: 'User'
  }
}, {
  id: 'user-login-create',
  action: ACTION_TYPE.create,
  path: '/login',
  schema: 'Login',
  rules: [RULE_DEFAULT.validateSchema, '@user/login']
}]
