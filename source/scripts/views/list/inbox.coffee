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
    super

    @list.permanent = true
    @list.name = text.inbox

    @makeDroppable()

    @updateCount()

    # @list.trigger 'select'

    # Change name with translations
    @listen event, 'load:language': =>
      @list.name = text.inbox

  remove: ->
    @drop.remove()
    @unbind()
    @stopListening()

module.exports = ListInbox
