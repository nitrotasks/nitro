Base  = require 'base'
List  = require '../models/list'
Task  = require '../models/task'
event = require '../utils/event'

class Search

  constructor: ->

    event.on 'search search:all', @searchAll
    event.on 'search:completed', @searchCompleted


  searchAll: (query) =>

    List.trigger 'select:model',
      name: 'All Tasks'
      id: 'search'
      type: 'active'
      permanent: yes
      query: query

  searchCompleted: (query) =>

    List.trigger 'select:model',
      name: 'Completed'
      id: 'search'
      type: 'completed'
      permanent: yes
      query: query

module.exports = Search
