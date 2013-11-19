Base  = require 'base'
List  = require '../models/list'
Task  = require '../models/task'
event = require '../utils/event'
Tasks = require '../views/tasks'

class Search

  constructor: ->

    event.on 'search', @search

  search: (query) =>

    List.trigger 'select:model',
      name: 'Search'
      id: 'search'
      permanent: yes
      query: query

module.exports = Search
