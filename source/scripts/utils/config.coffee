
servers = {
  official:  'sync.nitrotasks.com:443'
  dev:       'localhost:8080'
}

# Set active server
active = servers.dev

module.exports =
  sync:   active
  server: active
  email:  active + '/email'
