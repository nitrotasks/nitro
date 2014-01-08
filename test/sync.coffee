sync = list = task = user = null
should = require 'should'

describe 'Sync', ->

  before ->
    global.localStorage = {}
    global.window = {}
    global.SockJS = require './mockjs'

    sync = require '../source/scripts/controllers/sync'
    list = require '../source/scripts/models/list'
    task = require '../source/scripts/models/task'
    user = require '../source/scripts/models/user'

  after ->
    delete global.localStorage
    delete global.window
    delete global.SockJS

  expect = (message, done) ->
    SockJS.read = (text) ->
      text.should.equal message
      done()

  describe 'Connection', ->

    it 'should connect to server', ->
      sync.connect()

    it 'should send auth code to server', (done) ->
      user.id = 10
      user.token = 'i-miss-the-internet'

      expect "user.auth(#{ user.id },\"#{ user.token }\").fn(0)", ->
        SockJS.reply 'Jandal.fn_0(true)'
        done()

  describe 'Emit events to the server', ->

    it 'should create a list', (done) ->

      message = 'list.create({"id":"c0","name":"List One","tasks":[],"permanent":false}).fn(1)'

      callback = ->
        SockJS.reply 'Jandal.fn_1("s0")'
        done()

      expect message, callback

      list.create
        name: 'List One'

    it 'should create a task', (done) ->

      message = 'task.create({"id":"c0","listId":"c0","date":null,"name":"Task One","notes":"","priority":1,"completed":false}).fn(2)'

      callback = ->
        SockJS.reply 'Jandal.fn_2("s1")'
        done()

      expect message, callback

      task.create
        name: 'Task One'
        listId: 'c0'


