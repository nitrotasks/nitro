ListItem = require './item'

class ListInbox extends ListItem

  constructor: ->
    super

    @render()

    ###
    # Set up draggable on inbox
    @el.droppable
      hoverClass: 'ui-state-active'
      tolerance: 'pointer'
      drop: (event, ui) =>
        movedTask = Task.get(ui.draggable.attr('id').slice(5))
        List.current.moveTask(movedTask, List.get('inbox'))
    ###

  render: =>
    @bind $ '.inbox.list'

  # Show completed
  showCompleted: =>
    @list.trigger 'select'

module.exports = ListInbox
