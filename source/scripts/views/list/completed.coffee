Task = require '../../models/task'
List = require '../../models/list'
ListItem = require './item'

class ListCompleted extends ListItem

  el: '.completed.list'

  constructor: ->
    super

    Task.on 'change:completed:model', @updateCount

    @updateCount()


  open: =>
    List.trigger 'select:model',
      name: 'Completed'
      id: 'completed'
      disabled: yes
      permanent: yes
      tasks: Task.completed()
    @select()

  updateCount: =>
    @ui.count.text Task.completed().length

module.exports = ListCompleted
