Spine    = require("spine")
Task     = require("models/task")
List     = require("models/list")
Setting  = require("models/setting")
TaskItem = require("controllers/tasks.item")
Keys     = require("utils/keys")

class Tasks extends Spine.Controller

  template: Handlebars.compile require('views/task')

  elements:
    "ul.tasks": "tasks"
    "input.new-task": "input"

  events:
    "keyup input.new-task": "new"
    "click": "collapseAll"

  # Store currently loaded tasks
  items: []

  constructor: ->
    super
    Task.bind "create", @addOne
    Task.bind "refresh", @reload
    List.bind "changeList", @render
    Setting.bind "changeSort", @render

    $("body").on "mouseover", ".main .task", ->

      if Setting.sortMode() and not $(this).hasClass("ui-draggable")

        $(this).draggable
          distance: 10
          scroll: false
          cursorAt:
            top: 15
            left: 30
          helper: (event, task) ->
            id = $(task).attr("id")
            element = "<div data-id=\"#{ id }\" class=\"helper\">#{ $(this).find('.name').text() }</div>"
            $("body").append(element)
            $("[data-id=#{ id }]")

  addOne: (task) =>
    return unless List.current.id in [task.list, "all"]
    @tasks.prepend @template task
    view = new TaskItem
      el: @tasks.find("#task-#{ task.id }")
      task: task
    @items.push view

  reload: =>
    @render List.current if List.current

  render: (list) =>

    # Update current list if the list is changed
    @list = list if list

    # Disable task input box
    if @list.disabled then @input.hide() else @input.show()

    # Unbind existing tasks
    for item in @items
      item.release()
    @items = []
    @tasks.empty()

    if list.id is "filter"
      tasks = list.tasks
    else
      tasks = Task.list(@list.id)

    html = ""

    if Setting.sortMode()
      tasks = Task.sort(tasks)
      last = tasks[0]?.priority
      for task in tasks
        if not task.completed and task.priority isnt last
          task = task.clone()
          task.group = yes
        last = task.priority
        html = @template(task) + html

    else
      for task in tasks
        html = @template(task) + html

        # Fuckit, I'll refactor laterz
        $(this.el[1]).sortable
          distance: 10
          scroll: false
          cursorAt:
            top: 15
            left: 30
          helper: (event, task) ->
            id = $(task).attr("id")
            element = "<div data-id=\"#{ id }\" class=\"helper\">#{ $(task).find('.name').text() }</div>"
            $("body").append(element)
            $("[data-id=#{ id }]")

    @tasks.html html

    setTimeout =>
      for task in tasks
        view = new TaskItem
          task: task
          el: @tasks.find("#task-#{ task.id }")
        @items.push view
    , 1

  new: (e) ->
    val = @input.val()
    if e.which is Keys.ENTER and val
      if Setting.sortMode()
        if $(".main .tasks .seperator").length == 0
          $(".main .tasks").prepend("<li class='seperator'></li>")

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

      if Setting.sortMode()
        @el.find(".expanded").draggable({ disabled: false })
      else
        @el.find(".expanded").parent().sortable({ disabled: false })

      @el.find(".expanded")
        .removeClass("expanded")
        .find(".notes")
        .removeClass("auto")

module.exports = Tasks
