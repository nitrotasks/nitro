Base  = require 'base'
List  = require '../models/list'
Task  = require '../models/task'
event = require '../utils/event'
Translate = require '../utils/translate'

text = {}

event.on 'load:language', ->
  text = Translate
    all: 'All Tasks'
    completed: 'Completed'

class Search

  constructor: ->

    event.on 'search search:all', @searchAll
    event.on 'search:completed', @searchCompleted


  searchAll: (query) =>

    List.trigger 'select:model',
      name: text.all
      id: 'search'
      type: 'active'
      permanent: yes
      query: query

  searchCompleted: (query) =>

    List.trigger 'select:model',
      name: text.completed
      id: 'search'
      type: 'completed'
      permanent: yes
      query: query

module.exports = Search
