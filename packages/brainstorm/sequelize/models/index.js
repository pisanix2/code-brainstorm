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

module.exports = db
