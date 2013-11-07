Task = require '../../models/task'
List = require '../../models/list'
ListItem = require './item'

class ListCompleted extends ListItem

  constructor: ->
    super

    @bind $ '.completed.list'

    Task.on 'change:completed:model', @updateCount

    @updateCount()


  click: =>
    List.trigger 'select:model',
      name: 'Completed'
      id: 'completed'
      disabled: yes
      permanent: yes
      tasks: Task.completed()

    @select()

  updateCount: =>
    @count.text Task.completed().length

module.exports = ListCompleted