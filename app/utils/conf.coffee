server =
  server: "ec2-107-22-18-125.compute-1.amazonaws.com"
  sync: "ec2-107-22-18-125.compute-1.amazonaws.com:80"

localhost =
  server: "localhost:8080"
  sync: "localhost:8080"

active = server
active.EMAIL_LIST = "http://#{active.server}/api/email"
module.exports = active
