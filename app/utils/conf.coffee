server =
  server: "sync.nitrotasks.com:443/api"
  sync: "sync.nitrotasks.com:443"

localhost =
  server: "localhost:443/api"
  sync: "localhost:443"

active = server
active.EMAIL_LIST = "http://#{active.server}/email"
module.exports = active
