queue = null
should = require 'should'

describe '[Queue]', ->

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

  describe '[optimize]', ->

    test = (events, result) ->
      timestamps = []
      for event, i in events
        timestamps[i] = queue.push.apply queue, event

      replace = (text) ->
        match = text.match /^ts_(\d+)$/
        if match then return timestamps[match[1]]
        match = text.match /^ts_(\d+)_(\w+)$/
        if match then return timestamps[match[1]][match[2]]
        return text

      for item in result
        for value, i in item
          if typeof value is 'string'
            item[i] = replace(value)
          else if typeof value is 'object' and not Array.isArray value
            for key, text of value
              continue unless typeof text is 'string'
              item[i][key] = replace(text)


      queue.toJSON().should.eql result
      queue.clear()

    it 'create + update = create', ->

      test [
        ['task', 'create', {id: 20, name: 'Test'}]
        ['task', 'update', {id: 20, name: 'Test - Updated'}]
        ['task', 'update', {id: 20, name: 'Test - Updated Again'}]
      ], [
        ['task', 'create', {id: 20, name: 'Test - Updated Again'}, 'ts_2_name']
      ]

    it 'create + destroy = nothing', ->

      test [
        ['list', 'create', {id: 30, name: 'List'}]
        ['list', 'destroy', 30]
      ], []

    it 'create + update + destroy = nothing', ->

      test [
        ['task', 'create', {id: 10, name: 'Task'}]
        ['task', 'update', {id: 10, name: 'Task - Updated'}]
        ['task', 'destroy', 10]
      ], []

    it 'update + destroy = destroy', ->

      test [
        ['list', 'update', {id:15, name: 'List - Updated'}]
        ['list', 'destroy', 15]
      ], [
        ['list', 'destroy', 15, 'ts_1']
      ]

    it 'update + update = update', ->

      test [
        ['task', 'update', {id: 5, name: 'Task'}]
        ['task', 'update', {id: 5, listId: 30}]
        ['task', 'update', {id: 5, notes: 'notes'}]
      ], [
        ['task', 'update', {
          id: 5
          name: 'Task'
          listId: 30
          notes: 'notes'
        }, {
          name: 'ts_0_name'
          listId: 'ts_1_listId'
          notes: 'ts_2_notes'
        }]
      ]


