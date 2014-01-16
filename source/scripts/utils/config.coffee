
servers = {
  official: 'sync.nitrotasks.com:443'
  local:    'localhost:8080'
  heroku:   'nitro-server.herokuapp.com'
}

# Set active server
active = servers.local

module.exports =
  server: active
  sync:   active + '/socket'
  email:  active + '/email'
