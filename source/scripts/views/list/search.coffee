Task = require '../../models/task'
List = require '../../models/list'
ListItem = require './item'

class ListSearch extends ListItem

  constructor: ->

    super

    @bind $ '.search.list'

  click: =>
    List.trigger 'select:model',
      name: 'Search'
      id: 'search'
      permanent: yes
      tasks: Task.all()

    @select()

module.exports = ListSearch