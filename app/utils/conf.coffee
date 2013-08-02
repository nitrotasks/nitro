server =
  server: "sync.nitrotasks.com:443/api"
  sync: "sync.nitrotasks.com:443"

localhost =
  server: "localhost:8080/api"
  sync: "localhost:8080"

# Set active server
active = localhost

active.EMAIL_LIST = "http://#{active.server}/email"
module.exports = active
