const moment = require('moment')

const { createLogger, format, transports } = require('winston')
const { combine, timestamp, label, printf } = format

const myFormat = printf(info => {
  return `[${moment(info.timestamp).format('DD/MM/YYYY HH:mm:ss.SSS')}] [${info.level}] [${info.label}]: ${info.message}`
})

module.exports = (options = {}) => {
  let { ctx = 'Global' } = options
  const logger = createLogger({
    format: combine(
      label({ label: ctx }),
      timestamp(),
      format.colorize(),
      myFormat
    ),
    transports: [new transports.Console({
      level: process.env.LOGGER_LEVEL
    })]
  })

  return logger
}