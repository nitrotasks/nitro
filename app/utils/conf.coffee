heroku =
  server: "nitro-sync-v2.herokuapp.com"
  sync: "nitro-sync-v2.herokuapp.com:80"

ec2 =
  server: "ec2-107-22-18-125.compute-1.amazonaws.com"
  sync: "ec2-107-22-18-125.compute-1.amazonaws.com:80"

beta =
  server: "sync.nitrotasks.com"
  sync: "sync.nitrotasks.com:80"

localhost =
  server: "localhost:5000"
  sync: "localhost:5000"

jono =
  server: "192.168.0.106:5000"
  sync: "192.168.0.106:5000"


active = beta
active.EMAIL_LIST = "http://#{active.server}/api/email"
module.exports = active
