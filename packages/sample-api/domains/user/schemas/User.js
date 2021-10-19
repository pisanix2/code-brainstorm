const schema = {
  $id: 'https://example.com/user.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'User',
  type: 'object',
  properties: {
    id_tenant: { type: 'string' },
    login: { type: 'string' },
    password: { type: 'string' }
  },
  required: ['id_tenant', 'login', 'password']
}

module.exports = schema
