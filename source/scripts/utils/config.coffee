
servers = {
  official: 'sync.nitrotasks.com:443'
  local:    'localhost:8080'
  heroku:   'nitro-server.herokuapp.com'
  custom:   '192.168.0.100:8080'
}

# Set active server
active = servers.heroku

module.exports =
  server: active
  sync:   active + '/socket'
  email:  active + '/email'
