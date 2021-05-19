const { ACTION_TYPE, RULE_DEFAULT } = require('@packages/brainstorm/shared/enums')

module.exports = [{
  id: 'product-read-by-id',
  action: ACTION_TYPE.readById,
  path: '/product/:id',
  schema: 'Product',
  rules: [RULE_DEFAULT.readById],
  docs: {
    summary: 'teste doc api',
    tags: ['Product'],
    outputSchema: 'Product',
    params: {
      'id': { description: 'ID do registro', type: 'string' }
    }
  }
}, {
  id: 'product-read',
  action: ACTION_TYPE.read,
  path: '/product',
  schema: 'Product',
  rules: [RULE_DEFAULT.read],
  docs: {
    outputSchema: 'Product'
  }
}, {
  id: 'product-create',
  action: ACTION_TYPE.create,
  path: '/product',
  schema: 'Product',
  rules: [RULE_DEFAULT.validateSchema, RULE_DEFAULT.create],
  docs: {
    outputSchema: 'Product'
  }
}/*, {
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
}*/]
