Mouse = require '../../utils/mouse'
Base = require 'base'

class ListItem extends Base.View

  template: require '../../templates/list'

  ui:
    name: '.name'
    count: '.count'

  events: Base.touchify
    mouseup: 'mouseup'

  constructor: ->
    super

    # Some lists may not have a list model
    # such as All Tasks and Completed
    return unless @list?

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

    # Set up droppable handler
    el = @el[0]
    el.list = @list
    @drop = Mouse.tasks.addDrop(el)

    return this

  mouseup: (e) =>
    if Mouse.lists.isMoving() then return
    @open()

  # Override this method in special lists
  updateCount: =>
    @ui.count.text @list.tasks.length

  updateName: =>
    @ui.name.text @list.name

  # Override this method in special lists
  open: =>
    @list.trigger 'select'

  select: =>
    @el.addClass 'current'

  remove: =>
    @drop.remove()
    @release()

module.exports = ListItem
