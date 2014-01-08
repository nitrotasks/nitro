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
    queue.push 'task', 'create', {id: 20, name: 'Test'}
    timestamp = Date.now()
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
      queue.push 'task', 'update', {id: 20, name: 'Test - Updated Again'}

      queue.optimize()

      console.log queue.toJSON()

    it 'create + destroy = nothing', ->

    it 'update + destroy = destroy', ->

    it 'update + update = update', ->


