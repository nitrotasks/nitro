Mouse = require '../../utils/mouse'
ListItem = require './item'
List = require '../../models/list'
translate = require '../../utils/translate'
event = require '../../utils/event'

text = translate
  inbox: 'Inbox'

class ListInbox extends ListItem

  el: '.inbox.list'

  constructor: ->
    @list = List.get 'inbox'

    super

    # Make droppable
    @el[0].list = @list
    Mouse.addDrop @el[0]

    @list.name = text.inbox

    # Change name with translations
    event.on 'load:language', =>
      @list.name = text.inbox

    @updateCount()

    @list.trigger 'select'

module.exports = ListInbox
