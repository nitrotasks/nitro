queue = null
should = require 'should'

describe 'Queue', ->

  before ->
    global.localStorage = {}
    queue = require '../source/scripts/utils/queue'

  after ->
    queue.clear()
    delete global.localStorage

  timestamp = null

  it 'should add to the queue', ->
    timestamp = queue.push 'task', 'create', {id: 20, name: 'Test'}
    queue.toJSON().should.eql [
      ['task', 'create', {id: 20, name: 'Test'}, timestamp]
    ]

  it 'should save to localStorage', ->
    json = '[["task","create",{"id":20,"name":"Test"},' + timestamp + ']]'
    global.localStorage.queue.should.equal json

  it 'should clear the queue', ->
    queue.clear()
    queue.toJSON().should.eql []
    global.localStorage.queue.should.equal '[]'

  describe '#optimize', ->

    it 'create + update = create', ->
      queue.push 'task', 'create', {id: 20, name: 'Test'}
      queue.push 'task', 'update', {id: 20, name: 'Test - Updated'}
      timestamp = queue.push('task', 'update', {id: 20, name: 'Test - Updated Again'}).name
      queue.toJSON().should.eql [['task', 'create', {id: 20, name: 'Test - Updated Again'}, timestamp]]
      queue.clear()

    it 'create + destroy = nothing', ->
      queue.push 'list', 'create', {id: 30, name: 'List'}
      queue.push 'list', 'destroy', 30
      queue.toJSON().should.eql []
      queue.clear()

    it 'create + update + destroy = nothing', ->
      queue.push 'task', 'create', {id: 10, name: 'Task'}
      queue.push 'task', 'update', {id: 10, name: 'Task - Updated'}
      queue.push 'task', 'destroy', 10
      queue.toJSON().should.eql []
      queue.clear()

    it 'update + destroy = destroy', ->
      queue.push 'list', 'update', {id:15, name: 'List - Updated'}
      timestamp = queue.push 'list', 'destroy', 15
      queue.toJSON().should.eql [['list', 'destroy', 15, timestamp]]
      queue.clear()

    it 'update + update = update', ->
      name = queue.push('task', 'update', {id: 5, name: 'Task'}).name
      listId = queue.push('task', 'update', {id: 5, listId: 30}).listId
      notes = queue.push('task', 'update', {id: 5, notes: 'notes'}).notes
      queue.toJSON().should.eql [['task', 'update', {
        id: 5
        name: 'Task'
        listId: 30
        notes: 'notes'
      }, {
        name: name
        listId: listId
        notes: notes
      }]]
      queue.clear()


