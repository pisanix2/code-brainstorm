const Sequelize = require('sequelize')
const sqlFormatter = require('sql-formatter')
const config = require('../config')
const logger = require('../../shared/logger')({ ctx: 'database' })

const db = {}

config.logging = (sql) => {
  logger.debug(sqlFormatter.format(sql))
}

db.sequelize = new Sequelize(config.database, config.username, config.password, config)
db.Sequelize = Sequelize

db.associate = () => {
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db)
    }
  })
}

module.exports = db
