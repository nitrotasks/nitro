Mouse = require '../../utils/mouse'
ListItem = require './item'
List = require '../../models/list'

class ListInbox extends ListItem

  el: '.inbox.list'

  constructor: ->
    @list = List.get 'inbox'

    super

    # Make droppable
    @el[0].list = @list
    Mouse.addDrop @el[0]

    @updateCount()

    @list.trigger 'select'

module.exports = ListInbox
