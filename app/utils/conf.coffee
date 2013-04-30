server =
  server: "sync.nitrotasks.com"
  sync: "sync.nitrotasks.com:4000"

localhost =
  server: "localhost:8080"
  sync: "localhost:8080"

active = server
active.EMAIL_LIST = "http://#{active.server}/api/email"
module.exports = active
