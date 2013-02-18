heroku =
  server: "nitro-sync-v2.herokuapp.com"
  sync: "nitro-sync-v2.herokuapp.com:80"

localhost =
  server: "localhost:5000"
  sync: "localhost:5000"

jono =
  server: "192.168.0.106:5000"
  sync: "192.168.0.106:5000"


active = localhost

active.EMAIL_LIST = "http://#{active.server}/api/email"

module.exports = active
