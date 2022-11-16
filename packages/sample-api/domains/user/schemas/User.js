const schema = {
  $id: 'https://example.com/definitions/User',
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'User',
  type: 'object',
  primaryKey: 'id',
  properties: {
    id_tenant: { type: 'string' },
    login: { type: 'string' },
    password: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },

    profile: { // belongsToMany
      type: "array",
      items: {
        '$ref': '/definitions/Profile',
        foreignKey: 'id_user',
        as: 'profile',
        through: 'UserProfile'
      }
    },

    type: { // hasMany 
      type: "array",
      items: {
        '$ref': '/definitions/UserMedia',
        foreignKey: 'id_user',
        as: 'type'
      }
    }
    
    /*
    type: { // hasOne 
      '$ref': '/definitions/UserMedia',
      foreignKey: 'id_user',
      as: 'type'
    } 
    */
  },
  required: ['id_tenant', 'login', 'password']
}

module.exports = schema
