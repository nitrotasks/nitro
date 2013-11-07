ListItem = require './item'

class ListAll extends ListItem

  constructor: ->
    super

  showAllTasks: =>
    List.trigger 'change:current',
      name: $.i18n._('All Tasks')
      id: 'all'
      disabled: yes
      permanent: yes
    @el.find('.current').removeClass 'current'
    @all.addClass 'current'
    return

  updateAll: =>
    @inboxCount.text Task.active('inbox').length
    @allCount.text Task.active().length
    @completedCount.text Task.completed().length

    # Updates Counts for all other lists
    List.forEach (list) ->
      list.trigger('update:tasks')

module.exports = ListAll