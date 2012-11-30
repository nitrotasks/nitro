Spine    = require("spine")
Task     = require("models/task")
List     = require("models/list")
TaskItem = require("controllers/tasks.item")

class Tasks extends Spine.Controller
  ENTER_KEY = 13

  elements:
    "ul.tasks": "tasks"
    "input": "input"
    "h1": "listName"

  events:
    "keyup input.new-task": "new"
    "keyup h1": "rename"

  constructor: ->
    super
    Task.bind "create", @create
    Task.bind "refresh", @render
    List.bind "changeList", @render

  create: (task) =>
    taskItem = new TaskItem
      task: task
    @tasks
      .find(".p#{ task.priority }")
      .first()
      .before taskItem.render().el

  addOne: (task) =>
    taskItem = new TaskItem
      task: task
    @tasks.prepend taskItem.render().el

  render: (list) =>
    @list = list if list
    @listName.text @list.name

    # Disables contenteditable on noneditable lists
    if @list.id is "all" or @list.id is "inbox"
      @listName.removeAttr("contenteditable")
    else
      @listName.attr("contenteditable", true)

    if @list.disabled then @input.hide() else @input.show()
    @tasks.empty()
    tasks = Task.list(@list.id)
    last = tasks[0]?.priority
    for task in tasks
      if task.priority isnt last
        @tasks.prepend "<li class=\"sep\"></li>"
        last = task.priority
      @addOne task

  new: (e) ->
    val = @input.val()
    if e.which is ENTER_KEY and val
      Task.create
        name: val
        list: @list?.id
        priority: (->
          if val.indexOf("#high") >= 0 then return 3
          if val.indexOf("#medium") >= 0 then return 2
          if val.indexOf("#low") >= 0 then return 1
          return 0
        )()
      @input.val ""

  rename: (e) ->
    console.log("test")

module.exports = Tasks
