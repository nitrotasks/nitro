Spine    = require("spine")
Task     = require("models/task")
List     = require("models/list")
TaskItem = require("controllers/tasks.item")
Keys     = require("utils/keys")

class Tasks extends Spine.Controller

  elements:
    "ul.tasks": "tasks"
    "input.new-task": "input"

  events:
    "keyup input.new-task": "new"
    "click": "collapseAll"

  constructor: ->
    super
    Task.bind "create", @addOne
    Task.bind "refresh", @render
    List.bind "changeList", @render

  addOne: (task) =>
    taskItem = new TaskItem
      task: task
    @tasks.prepend taskItem.render().el

  render: (list) =>
    # Update current list if the list is changed
    @list = list if list

    # Disable task input box
    if @list.disabled then @input.hide() else @input.show()
    @tasks.empty()

    if list.id is "filter"
      tasks = list.tasks
    else
      tasks = Task.list(@list.id)

    last = tasks[0]?.priority
    for task in tasks
      if task.priority isnt last
        @tasks.prepend "<div class=\"sep\"></div>"
        last = task.priority
      @addOne task

  new: (e) ->
    val = @input.val()
    if e.which is Keys.ENTER and val
      Task.create
        name: val
        list: @list?.id
        completed: false
        priority: (->
          if val.indexOf("#high") >= 0 then return 3
          if val.indexOf("#medium") >= 0 then return 2
          return 1
        )()
      @input.val ""

  # Collapsing of tasks
  collapseAll: (e) ->
    # Only works on some elements
    # if e.target.nodeName in ["SECTION", "INPUT", "H1", "A"] or $(e.target).hasClass("title") or $(e.target).hasClass("tasks-container")
    if e.target.className is "main tasks"
      @el.find(".expanded")
        .removeClass("expanded")
        .draggable({ disabled: false })
        .find(".notes")
        .removeClass("auto")

module.exports = Tasks
