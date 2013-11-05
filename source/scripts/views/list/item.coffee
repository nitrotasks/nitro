Base = require 'base'

class ListItem extends Base.View

  template: require '../../templates/list'

  elements:
    '.name':  'name'
    '.count': 'count'

  events:
    'click': 'click'

  constructor: ->
    Base.touchify(@events)
    super

    @listen [
      @list,
        'select': @select
        'change': @updateName
        'before:destroy': @remove
      @list.tasks,
        'change': @updateCount
    ]

  # Create the list element
  render: =>

    @el = $ @template @list
    @bind()

    # TODO: Setup droppable
    # @el.droppable
    #   hoverClass: 'ui-state-active'
    #   tolerance: 'pointer'
    #   drop: (event, ui) =>
    #     movedTask = Task.get(ui.draggable.attr('id').slice(5))
    #     List.current.moveTask(movedTask, @list)

    return this

  updateCount: =>
    @count.text @list.tasks.length

  updateName: =>
    @name.text @list.name

  click: =>
    @list.trigger 'select'

  select: =>
    @el.addClass 'current'

  remove: =>
    @unbind()
    @el.remove()

module.exports = ListItem
