Task = require '../../models/task'
List = require '../../models/list'
ListItem = require './item'
event = require '../../utils/event'

class ListAll extends ListItem

  el: '.all.list'

  constructor: ->
    super

    event.on 'list:all', @open

    Task.on 'change change:completed:model', @updateCount

    @updateCount()

  open: =>
    event.trigger 'search'
    @select()

  updateCount: =>
    @ui.count.text Task.active().length

module.exports = ListAll
