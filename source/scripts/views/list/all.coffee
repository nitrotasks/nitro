Task = require '../../models/task'
List = require '../../models/list'
ListItem = require './item'
event = require '../../utils/event'

class ListAll extends ListItem

  constructor: ->
    super

    @bind $ '.all.list'

    Task.on 'change change:completed:model', @updateCount

    @updateCount()

  open: =>
    event.trigger 'search'
    @select()

  updateCount: =>
    @count.text Task.active().length

module.exports = ListAll