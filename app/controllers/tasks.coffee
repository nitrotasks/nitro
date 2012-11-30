Spine    = require("spine")
Task     = require("models/task")
List     = require("models/list")
TaskItem = require("controllers/tasks.item")

class Tasks extends Spine.Controller
  ENTER_KEY = 13

  elements:
    "ul": "tasks"
    "input": "input"
    "h1": "listName"

  events:
    "keyup input.new-task": "new"

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
    @list = list if list
    @listName.text @list.name
    if @list.disabled then @input.hide() else @input.show()
    @tasks.empty()
    last = Task.first().priority
    for task in Task.list(@list.id)
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

module.exports = Tasks
