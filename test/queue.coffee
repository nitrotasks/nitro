queue = null
should = require 'should'

CREATE = 0
UPDATE = 1
DESTROY = 2

describe '[Queue]', ->

  before ->
    global.localStorage = {}
    queue = require '../source/scripts/controllers/queue'

  after ->
    queue.clear()
    delete global.localStorage

  timestamp = null

  it 'should add to the queue', ->
    timestamp = queue.push 'task', 'create', {id: 20, name: 'Test'}
    queue.toJSON().should.eql
      task: [[CREATE, {id: 20, name: 'Test'}, timestamp]]

  it 'should save to localStorage', ->
    json = '{"task":{"20":[0,{"id":20,"name":"Test"},'+timestamp+']}}'
    global.localStorage.queue.should.equal json

  it 'should clear the queue', ->
    queue.clear()
    queue.toJSON().should.eql {}
    global.localStorage.queue.should.equal '{}'

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

      for classname, ids of result
        for id, item of ids
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

      input = [
        ['task', 'create', {id: 20, name: 'Test'}]
        ['task', 'update', {id: 20, name: 'Test - Updated'}]
        ['task', 'update', {id: 20, name: 'Test - Updated Again'}]
      ]

      output =
        task: [
          [CREATE, {id: 20, name: 'Test - Updated Again'}, 'ts_2_name']
        ]

      test input, output

    it 'create + destroy = nothing', ->

      input = [
        ['list', 'create', {id: 30, name: 'List'}]
        ['list', 'destroy', {id: 30}]
      ]

      output =
        list: []

      test input, output

    it 'create + update + destroy = nothing', ->

      input = [
        ['task', 'create', {id: 10, name: 'Task'}]
        ['task', 'update', {id: 10, name: 'Task - Updated'}]
        ['task', 'destroy', {id: 10}]
      ]

      output =
        task: []

      test input, output

    it 'update + destroy = destroy', ->

      input = [
        ['list', 'update', {id:15, name: 'List - Updated'}]
        ['list', 'destroy', {id: 15}]
      ]

      output =
        list: [
          [DESTROY, {id: 15}, 'ts_1']
        ]

      test input, output

    it 'update + update = update', ->

      input = [
        ['task', 'update', {id: 5, name: 'Task'}]
        ['task', 'update', {id: 5, listId: 30}]
        ['task', 'update', {id: 5, notes: 'notes'}]
      ]

      output =
        task: [
          [ UPDATE, {
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

      test input, output

    it 'optimizing multiple items', ->

      input = [
        ['list', 'create', {id: 0, name: 'List Zero'}]
        ['list', 'create', {id: 1, name: 'List One'}]
        ['list', 'create', {id: 2, name: 'List Two'}]
        ['list', 'update', {id: 1, name: 'List One - Updated'}]
        ['task', 'update', {id: 10, name: 'Task Ten - Updated'}]
        ['task', 'create', {id: 11, name: 'Task Eleven'}]
        ['pref', 'update', {id: 0, sort: false}]
        ['pref', 'update', {id: 0, sort: true}]
        ['list', 'update', {id: 2, name: 'List Two - Updated'}]
        ['task', 'create', {id: 12, name: 'Task Twelve'}]
        ['list', 'destroy', {id: 0}]
        ['list', 'destroy', {id: 1}]
        ['task', 'destroy', {id: 10}]
        ['task', 'create', {id: 13, name: 'Task Thirteen'}]
        ['task', 'update', {id: 14, name: 'Task Fourteen - Updated'}]
      ]

      output =
        list: [
          [CREATE, {id: 2, name: 'List Two - Updated'}, 'ts_8_name']
        ]
        task: [
          [DESTROY, {id: 10}, 'ts_12']
          [CREATE, {id: 11, name: 'Task Eleven'}, 'ts_5']
          [CREATE, {id: 12, name: 'Task Twelve'}, 'ts_9']
          [CREATE, {id: 13, name: 'Task Thirteen'}, 'ts_13']
          [UPDATE, {id: 14, name: 'Task Fourteen - Updated'}, {
            name: 'ts_14_name'
          }]
        ]
        pref: [
          [UPDATE, {id: 0, sort: true}, { sort: 'ts_7_sort' }]
        ]

      test input, output
