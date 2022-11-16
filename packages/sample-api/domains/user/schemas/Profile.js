const schema = {
  $id: 'https://example.com/definitions/Profile',
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Profile',
  type: 'object',
  primaryKey: 'id',
  properties: {
    title: { type: 'string' },

    user: { // belongsToMany
      type: "array",
      items: {
        '$ref': '/definitions/User',
        foreignKey: 'id_profile',
        as: 'user',
        through: 'UserProfile' // <-
      }
    },
  },
  required: ['title'],
}

module.exports = schema
