global.localStorage = {}
global.window = {}
global.SockJS = require './mockjs'

sync = require '../source/scripts/controllers/sync'
list = require '../source/scripts/models/list'
task = require '../source/scripts/models/task'

sync.connect()

SockJS.read = (message) ->
  console.log message
