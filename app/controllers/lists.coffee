Spine    = require("spine")
List     = require("models/list")
Task     = require("models/task")
ListItem = require("controllers/lists.item")
Keys     = require("utils/keys")
$        = Spine.$

class Lists extends Spine.Controller

  elements:
    "ul": "lists"
    "input": "input"
    ".list.all": "all"
    ".list.inbox": "inbox"
    ".list.all .count": "allCount"
    ".list.inbox .count": "inboxCount"

  events:
    "keyup input": "new"
    "click .list.all": "showAllTasks"
    "click .list.inbox": "showInbox"

  constructor: ->
    super
    List.bind "create", @addOne
    List.bind "refresh", @addAll
    List.bind "changeList", @change
    List.bind "destroy", @showInbox
    Task.bind "refresh change", @updateAll

    # Set up draggable on inbox
    @inbox.droppable
      hoverClass: "ui-state-active"
      drop: (event, ui) =>
        task = ui.draggable.data("item")
        task.updateAttribute("list", "inbox")

  new: (e) ->
    val = @input.val()
    if e.which is Keys.ENTER and val
      list = List.create name: val
      List.trigger "changeList", list
      @input.val ""

  addOne: (list) =>
    listItem = new ListItem( list: list )
    @lists.append listItem.render().el

  addAll: =>
    @lists.empty()
    List.each(@addOne)

  change: (list) =>
    List.current = list

  # Show all tasks
  showAllTasks: =>
    List.trigger "changeList",
      name: "All Tasks"
      id: "all"
      disabled: yes
      permanent: yes
    @el.find(".current").removeClass "current"
    @all.addClass "current"
    true

  # Show inbox
  showInbox: =>
    List.trigger "changeList",
      name: "Inbox"
      id: "inbox"
      permanent: yes
    @el.find(".current").removeClass "current"
    @inbox.addClass "current"
    true

  updateAll: =>
    @allCount.text Task.active().length
    @inboxCount.text Task.active("inbox").length

module.exports = Lists
