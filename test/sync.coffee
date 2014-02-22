
should = require('should')
Jandal = require('jandal')
Sandal  = require('./sandal')

describe '[Sync]', ->

  client = null
  pref = sync = list = task = user = null

  before ->
    global.localStorage = {}
    global.window = {}
    global.SockJS = -> return client.serverSocket

    sync = require('../source/scripts/controllers/sync')
    list = require('../source/scripts/models/list')
    task = require('../source/scripts/models/task')
    pref = require('../source/scripts/models/pref')
    user = require('../source/scripts/models/user')

    Sandal.setup()
    client = new Sandal()

  after ->
    delete global.localStorage
    delete global.window
    delete global.SockJS


  describe 'Connection', ->

    it 'should send auth code to server', (done) ->

      client.namespace('user').once 'auth', (token, fn) ->
        token.should.equal('token')

        client.namespace('queue').once 'sync', (data, time, fn) ->

          data.should.eql({})
          time.toString().length.should.equal(10)

          fn null,
            list: []
            task: []
            pref: {}

          done()

        fn(null, true)

      sync.connect('token')

  describe 'Emit events to the server', ->

    describe ':list', ->

      clientList = null

      beforeEach ->
        clientList = client.namespace('list')

      it ':create', (done) ->

        clientList.once 'create', (data, fn) ->

          data.should.eql name: 'List One'
          fn(null, 10)

          list.get(10).name.should.equal 'List One'
          should.equal list.get(-1), undefined

          done()

        list.create
          name: 'List One'

      it ':update', (done) ->

        clientList.once 'update', (id, data) ->

          id.should.equal(10)
          data.should.eql
            name: 'List One - Updated'

          done()

        list.get(10).name = 'List One - Updated'

      it ':destroy', (done) ->

        clientList.once 'destroy', (data) ->

          data.should.eql
            id: 10

          done()

        list.get(10).destroy()


    describe ':task', ->

      clientTask = null

      beforeEach ->
        clientTask = client.namespace('task')

      it ':create', (done) ->

        clientTask.once 'create', (data, fn) ->

          data.should.eql
            listId: -1
            date: 0
            name: 'Task One'
            notes: ''
            priority: 1
            completed: 0

          fn(null, 11)

          task.get(11).name.should.equal 'Task One'
          should.equal task.get(-1), undefined

          done()

        task.create
          name: 'Task One'
          listId: -1

      it ':update', (done) ->

        clientTask.once 'update', (id, data) ->

          id.should.equal(11)

          data.should.eql
            name: 'Task One - Updated'

          done()

        task.get(11).name = 'Task One - Updated'


      it ':destroy', (done) ->

        clientTask.once 'destroy', (data) ->

          data.should.eql
            id: 11

          done()

        task.get(11).destroy()

    describe ':pref', ->

      clientPref = null

      beforeEach ->
        clientPref = client.namespace('pref')

      it ':update', (done) ->

        clientPref.once 'update', (_null, data) ->

          data.should.eql
            language: 'en-NZ'

          done()

        pref.language = 'en-NZ'


  describe 'Server events', ->

    describe ':list', ->

      describe ':create', ->

        it 'should create a list', ->

          client.emit 'list.create',
            id: -1
            name: 'List Two'

          list.get(-1).name.should.equal 'List Two'

      describe ':update', ->

        it 'should update a list', ->

          client.emit 'list.update',
            id: -1
            name: 'List Two - Updated'

          list.get(-1).name.should.equal 'List Two - Updated'

      describe ':destroy', ->

        it 'should destroy a list', ->

          client.emit 'list.destroy',
            id: -1

          should.equal list.get(-1), undefined

    describe ':task', ->

      describe ':create', ->

        it 'should create a task', ->

          client.emit 'task.create',
            id: -3
            name: 'Task Two'

          task.get(-3).name.should.equal 'Task Two'


      describe ':update', ->

        it 'should update a task', ->

          client.emit 'task.update',
            id: -3
            name: 'Task Two - Updated'

          task.get(-3).name.should.equal 'Task Two - Updated'

      describe ':destroy', ->

        it 'should destroy a task', ->

          client.emit 'task.destroy',
            id: -3

          should.equal task.get(-3), undefined

    describe ':pref', ->

      describe ':update', ->

        it 'should update a pref', ->

          client.emit 'pref.update',
            id: -0
            language: 'en-us'

          pref.language.should.equal 'en-us'
