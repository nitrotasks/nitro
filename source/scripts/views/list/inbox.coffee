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

    @getInbox()

    # Make droppable
    Mouse.tasks.addDrop @el[0]

    @list.name = text.inbox

    # Change name with translations
    event.on 'load:language', =>
      @list.name = text.inbox

    List.on 'refresh', @getInbox

  getInbox: =>
    # FIXME: Mem Leak

    @list = List.get 'inbox'
    console.log 'getting inbox', @list

    @list.permanent = true
    @el[0].list = @list
    @updateCount()
    @list.trigger 'select'

    @listen [
      @list,
        'select': @select
        'change': @updateName
        'before:destroy': @remove
      @list.tasks,
        'change': @updateCount
    ]
module.exports = ListInbox
