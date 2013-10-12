ListItem = require './item'

class ListInbox extends ListItem

	constructor: ->
		super

	 # Set up draggable on inbox
    @el.droppable
      hoverClass: 'ui-state-active'
      tolerance: 'pointer'
      drop: (event, ui) =>
        movedTask = Task.get(ui.draggable.attr('id').slice(5))
        List.current.moveTask(movedTask, List.get('inbox'))

  # Show completed
  showCompleted: =>
    List.trigger 'change:current', List.get('inbox')
	    @el.find('.current').removeClass 'current'
	    @inbox.addClass 'current'
	    return

module.exports = ListInbox
