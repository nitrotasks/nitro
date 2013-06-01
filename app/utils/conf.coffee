server =
  server: "sync.nitrotasks/api"
  sync: "sync.nitrotasks.com/sockets"

localhost =
  server: "localhost:8080/api"
  sync: "localhost:8080/sockets"

active = server
active.EMAIL_LIST = "http://#{active.server}/email"
module.exports = active
