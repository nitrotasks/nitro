Mouse = require '../../utils/mouse'
Base = require 'base'

class ListItem extends Base.View

  template: require '../../templates/list'

  elements:
    '.name':  'name'
    '.count': 'count'

  events:
    'mousedown': 'mousedown'

  constructor: ->
    Base.touchify(@events)
    super

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
    Mouse.addDrop(el)

    return this

  mousedown: (e) =>
    e.preventDefault()
    e.stopPropagation()
    @open()

  # Override this method in special lists
  updateCount: =>
    @count.text @list.tasks.length

  updateName: =>
    @name.text @list.name

  # Override this method in special lists
  open: =>
    @list.trigger 'select'

  select: =>
    @el.addClass 'current'

  remove: =>
    Mouse.removeDrop @el[0]
    @release()

module.exports = ListItem
