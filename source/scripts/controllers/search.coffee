List = require '../models/list'
Base = require 'base'
event = require '../utils/event'

class Search

  constructor: ->
    super

    event.on 'search', @search

  search: (query='') =>

    List.trigger 'select:model',
      name: 'Search'
      id: 'search'
      permanent: yes
      tasks: Task.search query

module.exports = Search
