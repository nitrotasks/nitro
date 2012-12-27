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
    "keydown input.new-task": "new"
    "click": "collapseAllOnClick"

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

    # Translations
    task.notesplaceholder = $.i18n._("Notes")
    task.dateplaceholder = $.i18n._("Due Date")

    console.log(task)

    @tasks.prepend @template task
    view = new TaskItem
      el: @tasks.find("#task-#{ task.id }")
      task: task
    view.el.addClass("new")
    @items.push view

  reload: =>
    @render List.current if List.current

  render: (list) =>

    console.log ""

    console.time "list"

    console.time "start"

    # Update current list if the list is changed
    @list = list if list

    # Disable task input box
    if @list.disabled then @input.hide() else @input.show()
    console.timeEnd "start"

    console.time "release"

    oldItems = @items.slice(0)
    @items = []

    # Unbind existing tasks
    setTimeout ->
      for item in oldItems
        item.release()
    , 300
    console.timeEnd "release"

    console.time "getTasks"
    if list.id is "filter"
      tasks = list.tasks
    else if @list?.tasks
      tasks = (Task.find id for id in @list.tasks)
    else
      tasks = Task.list(@list.id)
    console.timeEnd "getTasks"

    html = ""

    console.time "toggleSort"
    # If the list is disabled, make sorting default
    Setting.toggleSort() if @list.disabled and !Setting.sortMode()
    console.timeEnd "toggleSort"

    console.time "sort"
    # Sorting tasks
    if Setting.sortMode()
      tasks = Task.sort(tasks)
      last = tasks[0]?.priority
      completed = tasks[0]?.completed
      for task in tasks
        # Add seperator if it is completed and the last one wasn't
        if completed and not task.completed
          completed = false
          task.group = yes
        # Add seperator if it is a different priority to the last one
        if not completed and task.priority isnt last
          task.group = yes
        last = task.priority

        # Translations
        task.notesplaceholder = $.i18n._("Notes")
        task.dateplaceholder = $.i18n._("Due Date")

        # Append html
        html = @template(task) + html

    else
      for task in tasks
        # Translations
        task.notesplaceholder = $.i18n._("Notes")
        task.dateplaceholder = $.i18n._("Due Date")

        html = @template(task) + html

    console.timeEnd "sort"

    console.time "html"
    @tasks[0].innerHTML = html
    console.timeEnd "html"

    console.time "sortable"
    if not @list.disabled
      self = @
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
        update: ( event, ui ) ->
          arr = []
          $(this).children().each (index) ->
            arr.unshift $(this).attr('id').slice(5)
          self.list.setOrder arr
    console.timeEnd "sortable"

    setTimeout =>
      for task in tasks
        view = new TaskItem
          task: task
          el: @tasks.find("#task-#{ task.id }")
        @items[@items.length] = view
    , 1000

    console.timeEnd "list"

    console.log ""


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

  # ----------------------------------------------------------------------------
  # COLLAPSE ALL
  # ----------------------------------------------------------------------------

  collapseAll: ->
    if Setting.sortMode()
      @el.find(".expanded").draggable({ disabled: false })
    else
      @el.find(".expanded").parent().sortable({ disabled: false })

    @el.find(".expanded")
      .removeClass("expanded")
      .find(".name")
      .blur()
      .attr("contenteditable", false)
      .parent()
      .find(".notes")
      .removeClass("auto")

  # Collapsing of tasks
  collapseAllOnClick: (e) =>
    # Only works on some elements
    # if e.target.nodeName in ["SECTION", "INPUT", "H1", "A"] or $(e.target).hasClass("title") or $(e.target).hasClass("tasks-container")
    if e.target.className is "main tasks"
      @collapseAll()

module.exports = Tasks
