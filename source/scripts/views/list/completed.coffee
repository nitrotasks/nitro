Task = require '../../models/task'
event = require '../../utils/event'
ListItem = require './item'

class ListCompleted extends ListItem

  el: '.completed.list'

  constructor: ->
    super

    Task.on 'change:completed:model', @updateCount

    @updateCount()

  open: =>
    event.trigger 'search:completed'
    @select()

  updateCount: =>
    @ui.count.text Task.completed().length

module.exports = ListCompleted
