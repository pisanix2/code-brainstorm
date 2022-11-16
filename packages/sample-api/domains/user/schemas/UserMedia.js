const schema = {
  $id: 'https://example.com/definitions/UserMedia',
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'UserMedia',
  type: 'object',
  primaryKey: 'id',
  properties: {
    id_user: { type: 'string' },
    url: { type: 'string' }
  },
  required: ['url', 'id_user'],
  belongsTo: [ // belongsTo
    { ref: 'User', foreignKey: 'id_user', as: 'user' }
  ]
}

module.exports = schema
