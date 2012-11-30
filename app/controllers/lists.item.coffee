Spine = require("spine")
Task  = require("models/task")
List  = require("models/list")

class ListItem extends Spine.Controller
  template: require("views/list")

  elements:
    '.count': 'count'

  events:
    'click': 'click'

  constructor: ->
    super
    throw "@list required" unless @list
    @list.bind "update", @render
    @list.bind "destroy", @remove
    Task.bind "create update destroy", @update
    @list.bind "changeList", @current

  render: =>
    @list.count = Task.active(@list.id).length
    @replace @template @list
    @el.droppable
      hoverClass: "ui-state-active"
      drop: (event, ui) =>
        task = ui.draggable.data("item")
        task.updateAttribute("list", @list.id)

    @current()
    @

  update: (task) =>
    # Only update if the task was in the list
    # if task.list is @list.id
    if task.list is @list.id
      @count.text Task.active(@list.id).length

  click: ->
    List.trigger "changeList", @list

  current: =>
    if List.current?.id is @list.id
      @el.parent().parent().find(".current").removeClass("current")
      @el.addClass "current"

  remove: ->
    @el.remove()

module.exports = ListItem
