Spine = require("spine")
Task  = require("models/task")
List  = require("models/list")

class ListItem extends Spine.Controller
  template: require("views/list")

  events:
    'click': 'click'

  constructor: ->
    super
    throw "@list required" unless @list
    @list.bind "update", @render
    @list.bind "destroy", @remove
    Task.bind "create update destroy", @update
    @list.bind "changeList", @active

  render: =>
    @list.count = Task.active(@list.id).length
    @replace @template @list
    @el.droppable
      hoverClass: "ui-state-active"
      drop: (event, ui) =>
        task = ui.draggable.data("item")
        task.updateAttribute("list", @list.id)

    @active()
    @

  click: =>
    @el.parent().parent().find(".current").removeClass("current")
    @el.addClass("current")
    List.trigger "changeList", @list
    true

  update: =>
    # Only update if the task was in the list
    # if task.list is @list.id
    @render()

  active: =>
    if List.current?.id is @list.id
      @el.addClass "active"

  remove: ->
    @el.remove()

module.exports = ListItem
