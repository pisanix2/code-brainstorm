
const entrypoint = {}

entrypoint.normalizePort = val => {
  let port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

entrypoint.onError = (error) => {
  const port = entrypoint.normalizePort(process.env.PORT || '3000')

  if (error.syscall !== 'listen') {
    throw error
  }

  let bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  if (error.code === 'EACCES') {
    console.error(bind + ' requires elevated privileges')
    return process.exit(1)
  }

  if (error.code === 'EADDRINUSE') {
    console.error(bind + ' is already in use')
    return process.exit(1)
  }

  throw error
}

entrypoint.onListening = server => {
  const port = entrypoint.normalizePort(process.env.PORT)

  console.log(`Listening on ${port}...`)
}

module.exports = entrypoint
