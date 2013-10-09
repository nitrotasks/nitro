
servers = {
  official:  'sync.nitrotasks.com:443'
  localhost: 'localhost:8080'
}

# Set active server
active = servers.official

module.exports =
  sync:   active
  server: active + '/api'
  email:  active + '/email'
