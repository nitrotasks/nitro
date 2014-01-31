pref = sync = list = task = user = null
should = require 'should'
client = require './mock_client'
Jandal = require 'jandal'

describe '[Sync]', ->

  before ->
    global.localStorage = {}
    global.window = {}
    global.SockJS = require './mockjs'

    sync = require '../source/scripts/controllers/sync'
    list = require '../source/scripts/models/list'
    task = require '../source/scripts/models/task'
    pref = require '../source/scripts/models/pref'
    user = require '../source/scripts/models/user'

  after ->
    delete global.localStorage
    delete global.window
    delete global.SockJS

  beforeEach ->
    SockJS.read = (message) -> console.log message
    client.callback = true

  expect = (event, fn) ->
    SockJS.read = (text) ->
      res = Jandal::parse(text)
      event.should.equal(res.namespace + '.' + res.event)
      fn res.arg1, res.arg2, res.arg3

  describe 'Connection', ->

    it 'should connect to server', ->
      sync.connect()

    it 'should send auth code to server', (done) ->
      user.uid = 10
      user.token = 'i-miss-the-internet'

      message = client.user.auth(user.uid, user.token)

      expect 'user.auth', (id, token) ->
        id.should.equal user.uid
        token.should.equal user.token
        expect 'user.info', ->
          expect 'queue.sync', -> done()
        SockJS.replyFn 0, 'null,true'

  describe 'Emit events to the server', ->

    it 'should create a list', (done) ->

      expect 'list.create', (_list) ->

        _list.should.eql
          id: -2
          name: 'List One'
          tasks: []

        SockJS.replyFn 3, 'null,10'

        list.get(10).name.should.equal 'List One'
        should.equal list.get(-2), undefined
        done()

      list.create
        name: 'List One'

    it 'should create a task', (done) ->

      expect 'task.create', (_task) ->

        _task.should.eql
          id: -2
          listId: -1
          date: 0
          name: 'Task One'
          notes: ''
          priority: 1
          completed: 0

        SockJS.replyFn 4, 'null,11'
        task.get(11).name.should.equal 'Task One'
        should.equal task.get(-2), undefined
        done()

      task.create
        name: 'Task One'
        listId: -1

    it 'should update the list name', (done) ->

      expect 'list.update', (_list) ->

        _list.should.eql
          id: 10
          name: 'List One - Updated'

        done()

      list.get(10).name = 'List One - Updated'

    it 'should update the task name', (done) ->

      expect 'task.update', (_task) ->

        _task.should.eql
          id: 11
          name: 'Task One - Updated'

        done()

      task.get(11).name = 'Task One - Updated'

    it 'should destroy a list', (done) ->

      expect 'list.destroy', (_list) ->

        _list.should.eql
          id: 10

        done()
      list.get(10).destroy()

    it 'should destroy a task', (done) ->

      expect 'task.destroy', (_task) ->

        _task.should.eql
          id: 11

        done()

      task.get(11).destroy()

    it 'should update a pref', (done) ->

      expect 'pref.update', (_pref) ->

        _pref.should.eql
          language: 'en-NZ'

        done()

      pref.language = 'en-NZ'


  describe 'React to events from the server', ->

    # Save keystrokes
    exec = (message) -> SockJS.reply(message)

    it 'should create a list', ->

      exec client.list.create
        id: -2
        name: 'List Two'

      list.get(-2).name.should.equal 'List Two'

    it 'should create a task', ->

      exec client.task.create
        id: -3
        name: 'Task Two'

      task.get(-3).name.should.equal 'Task Two'

    it 'should update a list', ->

      exec client.list.update
        id: -2
        name: 'List Two - Updated'

      list.get(-2).name.should.equal 'List Two - Updated'

    it 'should update a task', ->

      exec client.task.update
        id: -3
        name: 'Task Two - Updated'

      task.get(-3).name.should.equal 'Task Two - Updated'

    it 'should destroy a list', ->

      exec client.list.destroy
        id: -2

      should.equal list.get(-2), undefined

    it 'should destroy a task', ->

      exec client.task.destroy
        id: -3

      should.equal task.get(-3), undefined

    it 'should update a pref', ->

      exec client.pref.update
        id: -0
        language: 'en-us'

      pref.language.should.equal 'en-us'
