const schema = {
  $id: 'https://example.com/login.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Login',
  type: 'object',
  properties: {
    login: { type: 'string' },
    password: { type: 'string' }
  },
  required: ['login', 'password']
}

module.exports = schema
