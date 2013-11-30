ListItem = require './item'

class ListInbox extends ListItem

  constructor: ->
    super

    @bind $ '.inbox.list'

    @el[0].list = @list
    mouse.addDrop @el[0]

    @updateCount()

    ###
    # Set up draggable on inbox
    @el.droppable
      hoverClass: 'ui-state-active'
      tolerance: 'pointer'
      drop: (event, ui) =>
        movedTask = Task.get(ui.draggable.attr('id').slice(5))
        List.current.moveTask(movedTask, List.get('inbox'))
    ###

module.exports = ListInbox
