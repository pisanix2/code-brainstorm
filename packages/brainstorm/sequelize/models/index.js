const Sequelize = require('sequelize')
const sqlFormatter = require('sql-formatter')
const config = require('../config')
const logger = require('../../shared/logger')({ ctx: 'database' })

require('pg').types.setTypeParser(1114, stringValue => {
  return new Date(stringValue + '+0000');
  // e.g., UTC offset. Use any offset that you would like.
})

const db = {}

config.logging = (sql) => {
  logger.debug(sqlFormatter.format(sql))
}

db.sequelize = new Sequelize(config.database, config.username, config.password, config)
db.Sequelize = Sequelize

module.exports = db
