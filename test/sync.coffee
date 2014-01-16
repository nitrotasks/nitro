pref = sync = list = task = user = null
should = require 'should'
client = require './mock_client'

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
    client.callback = true

  expect = (message, done) ->
    SockJS.read = (text) ->

      if message.match('"<ts>"')
        timestamp = text.match(/\d{13}/)[0]
        _message = message.replace('"<ts>"', timestamp)
      else
        _message = message

      text.should.equal _message
      done()

  describe 'Connection', ->

    before ->
      client.timestamp = -> return '<ts>'

    it 'should connect to server', ->
      sync.connect()

    it 'should send auth code to server', (done) ->
      user.uid = 10
      user.token = 'i-miss-the-internet'

      message = client.user.auth(user.uid, user.token)

      expect message, ->
        expect client.user.info(), ->
          expect client.queue.sync({}), done
        SockJS.replyFn 0, 'null,true'

  describe 'Emit events to the server', ->

    before ->
      client.timestamp = -> return '<ts>'

    it 'should create a list', (done) ->

      message = client.list.create
        id: 'c0'
        name: 'List One'
        tasks: []
        permanent: false

      callback = ->
        SockJS.replyFn client.id, 'null,"s0"'
        list.get('s0').name.should.equal 'List One'
        should.equal list.get('c0'), undefined
        done()

      expect message, callback

      list.create
        name: 'List One'

    it 'should create a task', (done) ->

      message = client.task.create
        id: 'c0'
        listId: 'c0'
        date: 0
        name: 'Task One'
        notes: ''
        priority: 1
        completed: false

      callback = ->
        SockJS.replyFn client.id, 'null,"s1"'
        task.get('s1').name.should.equal 'Task One'
        should.equal task.get('c0'), undefined
        done()

      expect message, callback

      task.create
        name: 'Task One'
        listId: 'c0'

    it 'should update the list name', (done) ->

      client.callback = false

      message = client.list.update
        id: 's0'
        name: 'List One - Updated'

      expect message, done
      list.get('s0').name = 'List One - Updated'

    it 'should update the task name', (done) ->

      client.callback = false

      message = client.task.update
        id: 's1'
        name: 'Task One - Updated'

      expect message, done
      task.get('s1').name = 'Task One - Updated'

    it 'should destroy a list', (done) ->

      client.callback = false

      message = client.list.destroy
        id: 's0'

      expect message, done
      list.get('s0').destroy()

    it 'should destroy a task', (done) ->

      client.callback = false

      message = client.task.destroy
        id: 's1'

      expect message, done
      task.get('s1').destroy()

    it 'should update a pref', (done) ->

      client.callback = false

      message = client.pref.update
        id: 's0'
        language: 'en-NZ'

      expect message, done
      pref.language = 'en-NZ'


  describe 'React to events from the server', ->

    # Save keystrokes
    exec = (message) -> SockJS.reply(message)

    before ->
      client.timestamp = -> return Date.now()

    it 'should create a list', ->

      exec client.list.create
        id: 's2'
        name: 'List Two'

      list.get('s2').name.should.equal 'List Two'

    it 'should create a task', ->

      exec client.task.create
        id: 's3'
        name: 'Task Two'

      task.get('s3').name.should.equal 'Task Two'

    it 'should update a list', ->

      exec client.list.update
        id: 's2'
        name: 'List Two - Updated'

      list.get('s2').name.should.equal 'List Two - Updated'

    it 'should update a task', ->

      exec client.task.update
        id: 's3'
        name: 'Task Two - Updated'

      task.get('s3').name.should.equal 'Task Two - Updated'

    it 'should destroy a list', ->

      exec client.list.destroy
        id: 's2'

      should.equal list.get('s2'), undefined

    it 'should destroy a task', ->

      exec client.task.destroy
        id: 's3'

      should.equal task.get('s3'), undefined

    it 'should update a pref', ->

      exec client.pref.update
        id: 's0'
        language: 'en-us'

      pref.language.should.equal 'en-us'
###