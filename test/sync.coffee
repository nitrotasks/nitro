pref = sync = list = task = user = null
should = require 'should'

describe '[Sync]', ->

  before ->
    global.localStorage = {}
    global.window = {}
    global.SockJS = require './mockjs'

    sync = require '../source/scripts/controllers/sync'
    list = require '../source/scripts/models/list'
    task = require '../source/scripts/models/task'
    pref = require '../source/scripts/models/setting'
    user = require '../source/scripts/models/user'

  after ->
    delete global.localStorage
    delete global.window
    delete global.SockJS

  beforeEach ->
    SockJS.read = (message) -> console.log message

  expect = (message, done) ->
    SockJS.read = (text) ->
      text.should.equal message
      done()

  describe 'Connection', ->

    it 'should connect to server', ->
      sync.connect()

    it 'should send auth code to server', (done) ->
      user.uid = 10
      user.token = 'i-miss-the-internet'

      expect "user.auth(#{ user.uid },\"#{ user.token }\").fn(0)", ->
        expect "user.info().fn(1)", done
        SockJS.reply 'Jandal.fn_0(true)'

  describe 'Emit events to the server', ->

    it 'should create a list', (done) ->

      message = 'list.create({"id":"c0","name":"List One","tasks":[],"permanent":false}).fn(2)'

      callback = ->
        SockJS.reply 'Jandal.fn_2("s0")'
        list.get('s0').name.should.equal 'List One'
        should.equal list.get('c0'), undefined
        done()

      expect message, callback

      list.create
        name: 'List One'

    it 'should create a task', (done) ->

      message = 'task.create({"id":"c0","listId":"c0","date":null,"name":"Task One","notes":"","priority":1,"completed":false}).fn(3)'

      callback = ->
        SockJS.reply 'Jandal.fn_3("s1")'
        task.get('s1').name.should.equal 'Task One'
        should.equal task.get('c0'), undefined
        done()

      expect message, callback

      task.create
        name: 'Task One'
        listId: 'c0'

    it 'should update the list name', (done) ->
      message = 'list.update({"id":"s0","name":"List One - Updated"})'
      expect message, done
      list.get('s0').name = 'List One - Updated'

    it 'should update the task name', (done) ->
      message = 'task.update({"id":"s1","name":"Task One - Updated"})'
      expect message, done
      task.get('s1').name = 'Task One - Updated'

    it 'should destroy a list', (done) ->
      message = 'list.destroy("s0")'
      expect message, done
      list.get('s0').destroy()

    it 'should destroy a task', (done) ->
      message = 'task.destroy("s1")'
      expect message, done
      task.get('s1').destroy()

    it 'should update a pref', (done) ->
      message = 'pref.update({"id":0,"language":"en-nz"})'
      expect message, done
      pref.language = 'en-nz'


  describe 'React to events from the server', ->

    it 'should create a list', ->
      SockJS.reply 'list.create({"id":"s2","name":"List Two"})'
      list.get('s2').name.should.equal 'List Two'

    it 'should create a task', ->
      SockJS.reply 'task.create({"id":"s3","name":"Task Two"})'
      task.get('s3').name.should.equal 'Task Two'

    it 'should update a list', ->
      SockJS.reply 'list.update({"id":"s2","name":"List Two - Updated"})'
      list.get('s2').name.should.equal 'List Two - Updated'

    it 'should update a task', ->
      SockJS.reply 'task.update({"id":"s3","name":"Task Two - Updated"})'
      task.get('s3').name.should.equal 'Task Two - Updated'

    it 'should destroy a list', ->
      SockJS.reply 'list.destroy("s2")'
      should.equal list.get('s2'), undefined

    it 'should destroy a task', ->
      SockJS.reply 'task.destroy("s3")'
      should.equal task.get('s3'), undefined

    it 'should update a pref', ->
      SockJS.reply 'pref.update({"language":"en-us"})'
      pref.language.should.equal 'en-us'
