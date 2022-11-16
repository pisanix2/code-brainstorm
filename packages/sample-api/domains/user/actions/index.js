const { ACTION_TYPE, RULE_DEFAULT } = require('@pisanix/brainstorm/shared/enums')

module.exports = [{
  id: 'profile-read',
  action: ACTION_TYPE.read,
  path: '/profile',
  schema: 'Profile',
  include: [{
    association: 'user'
  }],
  rules: [RULE_DEFAULT.validateJWT, RULE_DEFAULT.read],
  docs: {
    outputSchema: 'Profile'
  }
}, {
  id: 'profile-create',
  action: ACTION_TYPE.create,
  path: '/profile',
  schema: 'Profile',
  include: [{
    association: 'user',
    include: [{ association: 'type' }]
  }],
  rules: [RULE_DEFAULT.validateJWT, RULE_DEFAULT.validateSchema, RULE_DEFAULT.create],
  docs: {
    outputSchema: 'Profile'
  }
},{
  id: 'user-media-read',
  action: ACTION_TYPE.read,
  path: '/user_media',
  schema: 'UserMedia',
  include: [{
    association: 'user'
  }],
  rules: [RULE_DEFAULT.validateJWT, RULE_DEFAULT.read],
  docs: {
    outputSchema: 'UserMedia'
  }
}, {
  id: 'user-media-create',
  action: ACTION_TYPE.create,
  path: '/user_media',
  schema: 'UserMedia',
  rules: [RULE_DEFAULT.validateJWT, RULE_DEFAULT.validateSchema, RULE_DEFAULT.create],
  docs: {
    outputSchema: 'UserMedia'
  }
}, {
  id: 'user-read-by-id',
  action: ACTION_TYPE.readById,
  path: '/user/:id',
  schema: 'User',
  rules: [RULE_DEFAULT.validateJWT, RULE_DEFAULT.readById],
  include: [{ association: 'type' }, { association: 'profile' }],
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
  include: [{ association: 'type' }, { association: 'profile' }],
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
  },
  include: [{ association: 'type' }, { association: 'profile' }],
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
  docs: {
    outputSchema: 'LoginResponse'
  },
  rules: [RULE_DEFAULT.validateSchema, '@user/login']
}]
