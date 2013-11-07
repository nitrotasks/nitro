Task = require '../../models/task'
List = require '../../models/list'
ListItem = require './item'

class ListAll extends ListItem

  constructor: ->
    super

    @bind $ '.all.list'

    Task.on 'change', @updateCount

    @updateCount()


  click: =>
    List.trigger 'select:model',
      name: 'All Tasks'
      id: 'all'
      disabled: yes
      permanent: yes
      tasks: Task.active()

    @select()

  updateCount: =>
    @count.text Task.active().length

module.exports = ListAll