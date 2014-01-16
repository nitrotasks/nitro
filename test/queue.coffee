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
      task: '20': [CREATE, {name: 'Test'}, timestamp]

  it 'should save to localStorage', ->
    json = '{"task":{"20":[0,{"name":"Test"},'+timestamp+']}}'
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

      test [
        ['task', 'create', {id: 20, name: 'Test'}]
        ['task', 'update', {id: 20, name: 'Test - Updated'}]
        ['task', 'update', {id: 20, name: 'Test - Updated Again'}]
      ], task: '20': [CREATE, {name: 'Test - Updated Again'}, 'ts_2_name']

    it 'create + destroy = nothing', ->

      test [
        ['list', 'create', {id: 30, name: 'List'}]
        ['list', 'destroy', {id: 30}]
      ], list: {}

    it 'create + update + destroy = nothing', ->

      test [
        ['task', 'create', {id: 10, name: 'Task'}]
        ['task', 'update', {id: 10, name: 'Task - Updated'}]
        ['task', 'destroy', {id: 10}]
      ], task: {}

    it 'update + destroy = destroy', ->

      test [
        ['list', 'update', {id:15, name: 'List - Updated'}]
        ['list', 'destroy', {id: 15}]
      ], list: '15': [DESTROY, {id: 15}, 'ts_1']

    it 'update + update = update', ->

      test [
        ['task', 'update', {id: 5, name: 'Task'}]
        ['task', 'update', {id: 5, listId: 30}]
        ['task', 'update', {id: 5, notes: 'notes'}]
      ],
        task:
          '5': [ UPDATE, {
            name: 'Task'
            listId: 30
            notes: 'notes'
          }, {
            name: 'ts_0_name'
            listId: 'ts_1_listId'
            notes: 'ts_2_notes'
          }]

    it 'optimizing multiple items', ->

      test [
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
      ],
        list:
          '2': [CREATE, {name: 'List Two - Updated'}, 'ts_8_name']
        task:
          '10': [DESTROY, {id: 10}, 'ts_12']
          '11': [CREATE, {name: 'Task Eleven'}, 'ts_5']
          '12': [CREATE, {name: 'Task Twelve'}, 'ts_9']
          '13': [CREATE, {name: 'Task Thirteen'}, 'ts_13']
          '14': [UPDATE, {name: 'Task Fourteen - Updated'}, {
            name: 'ts_14_name'
          }]
        pref:
          '0': [UPDATE, {sort: true}, {
            sort: 'ts_7_sort'
          }]
