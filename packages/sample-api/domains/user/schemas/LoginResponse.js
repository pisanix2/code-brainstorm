const schema = {
  $id: 'https://example.com/definitions/LoginResponse',
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'LoginResponse',
  type: 'object',
  primaryKey: 'id',
  properties: {
    access_token: { type: 'string' },
    type: { type: 'string' }
  }
}

module.exports = schema
