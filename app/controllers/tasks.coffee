Spine    = require("spine")
Task     = require("models/task")
List     = require("models/list")
TaskItem = require("controllers/tasks.item")

class Tasks extends Spine.Controller
  template: require('views/task')
  ENTER_KEY = 13

  elements:
    "ul.tasks": "tasks"
    "input": "input"
    "h1": "listName"

  events:
    "keyup input.new-task": "new"
    "keyup h1": "rename"
    "keypress h1": "preventer"

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

    # Disables contenteditable on noneditable lists
    if @list.id is "all" or @list.id is "inbox"
      @listName.removeAttr("contenteditable")
    else
      @listName.attr("contenteditable", true)

    if @list.disabled then @input.hide() else @input.show()
    # @tasks.empty()
    tasks = Task.list(@list.id)
    @tasks.html @template tasks
    # last = tasks[0]?.priority
    # for task in tasks
    #   if task.priority isnt last
    #     @tasks.prepend "<li class=\"sep\"></li>"
    #     last = task.priority
    #   @addOne task

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
    # This is fired on keyup when a list is renamed
    List.current.updateAttribute("name", @listName.text())

  preventer: (e) ->
    # Prevents the enter key
    e.preventDefault() if e.keyCode is 13

module.exports = Tasks
