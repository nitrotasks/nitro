ListItem = require './item'

class ListCompleted extends ListItem

  # Show completed
  showCompleted: =>
    List.trigger 'change:current',
      name: $.i18n._('Completed')
      id: 'completed'
      permanent: yes
      disabled: yes
    @el.find('.current').removeClass 'current'
    @completed.addClass 'current'
    return

module.exports = ListCompleted