
servers = {
  official: 'http://sync.nitrotasks.com:443'
  local:    'http://localhost:8080'
  custom:   'http://192.168.0.100:8080'
  heroku:   'https://nitro-server.herokuapp.com'
}

# Set active server
active = servers.heroku

module.exports =
  server: active
  sync:   active + '/socket'
  email:  active + '/email'
