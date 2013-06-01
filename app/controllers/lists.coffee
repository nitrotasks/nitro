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
    ".list.completed": "completed"
    ".list.all .count": "allCount"
    ".list.inbox .count": "inboxCount"
    ".list.completed .count": "completedCount"

  events:
    "keyup input": "new"
    "click .title img": "searchToggle"
    "click .list.all": "showAllTasks"
    "click .list.inbox": "showInbox"
    "click .list.completed": "showCompleted"

  constructor: ->
    Spine.touchify(@events)
    super
    List.bind "create", @addOne
    List.bind "refresh", @addAll
    List.bind "changeList", @change
    List.bind "destroy", @showInbox
    Task.bind "refresh change", @updateAll

    # Set up draggable on inbox
    @inbox.droppable
      hoverClass: "ui-state-active"
      tolerance: "pointer"
      drop: (event, ui) =>
        movedTask = Task.find(ui.draggable.attr("id").slice(5))
        List.current.moveTask(movedTask, List.find("inbox"))

  searchToggle: (e) ->
    $(".sidebar .searchToggle, .sidebar .normal").toggleClass("hide")

    if $(".sidebar .normal").hasClass("hide")
      $(".sidebar .title input").val("").focus()
    else
      $("header .search input").val("").trigger "keyup"

  new: (e) ->

    # Handles correct box
    if $(e.currentTarget).hasClass("searcher")
      $("header .search input").val($(e.currentTarget).val()).trigger "keyup"

      # Overides the other function thingy
      if val.length is 0
        $(e.currentTarget).focus()
    else
      if e.which is Keys.ENTER and $(e.currentTarget).val()
        list = List.create name: $(e.currentTarget).val()
        List.trigger "changeList", list
        $(e.currentTarget).val ""

  addOne: (list) =>
    return if list.id is "inbox"
    listItem = new ListItem( list: list )
    @lists.append listItem.render().el

  addAll: =>
    @lists.empty()
    List.each(@addOne)

  change: (list) =>
    $(".sidebar").removeClass("show")
    List.current = list

  # Show all tasks
  showAllTasks: =>
    List.trigger "changeList",
      name: $.i18n._("All Tasks")
      id: "all"
      disabled: yes
      permanent: yes
    @el.find(".current").removeClass "current"
    @all.addClass "current"
    true

  # Show inbox
  showInbox: =>
    List.trigger "changeList", List.find("inbox")
    @el.find(".current").removeClass "current"
    @inbox.addClass "current"
    true

  # Show completed
  showCompleted: =>
    List.trigger "changeList",
      name: $.i18n._("Completed")
      id: "completed"
      permanent: yes
      disabled: yes
    @el.find(".current").removeClass "current"
    @completed.addClass "current"
    true

  updateAll: =>
    @allCount.text Task.active().length
    @completedCount.text Task.completed().length

    # Updates Counts for all other lists
    for list in List.all()
      list.trigger("update:tasks")

module.exports = Lists
