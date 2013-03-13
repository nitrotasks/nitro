Spine    = require("spine")
Task     = require("models/task")
List     = require("models/list")
Setting  = require("models/setting")
TaskItem = require("controllers/tasks.item")
Keys     = require("utils/keys")
dateDetector = require("utils/date")

class Tasks extends Spine.Controller

  template: (->
    require('views/task')
    Handlebars.templates['task']
  )()

  elements:
    "ul.tasks": "tasks"
    "input.new-task": "input"

  events:
    # "mouseover": "scrollbars"
    "scroll": "scrollbars"
    "keydown input.new-task": "new"
    "click": "collapseAllOnClick"

  # Store currently loaded tasks
  items: []
  timers: {}

  constructor: ->
    Spine.touchify(@events)
    super
    Task.bind "create", @addOne
    Task.bind "refresh", @reload
    List.bind "changeList", @render
    Setting.bind "changeSort", @render

    # I'm not sure how this works. Silly jQUery UI
    $("body").on "mouseover", ".main .task", ->

      if Setting.sortMode() and not $(this).hasClass("ui-draggable") and not List.current.disabled

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

  addOne: (task) =>
    return unless List.current.id in [task.list, "all"]

    # Translations
    task.notesplaceholder = $.i18n._("Notes")
    task.dateplaceholder = $.i18n._("Due Date")

    @tasks.prepend @template task
    view = new TaskItem
      el: @tasks.find("#task-#{ task.id }")
      task: task
    view.el.addClass("new")
    @items.push view
    @el.removeClass "empty"

  reload: =>
    @render List.current if List.current

  render: (list) =>

    if @timers.bindTasks? then clearTimeout @timers.bindTasks

    @el.removeClass "empty"

    # Update current list if the list is changed
    @list = list if list

    #Something
    if @list.disabled
        $(@el[1]).sortable({ disabled: true })
    else
      if not Setting.sortMode()
        $(@el[1]).sortable({ disabled: false })

    # Disable task input box
    if @list.disabled then @input.hide() else @input.show()

    oldItems = @items.slice(0)
    @items = []

    # Unbind existing tasks
    setTimeout ->
      for item in oldItems
        item.release()
    , 100

    html = ""

    @el.find(".message").remove()
    if @list.id is "filter"
      tasks = @list.tasks
      @el.append "<div class='message'>" + $.i18n._("No tasks could be found.") + "</div>"
    else if @list?.tasks
      tasks = (Task.find id for id in @list.tasks)
      @el.append  "<div class='message'>" + $.i18n._("You haven't added any tasks to this list.") + "</div>"
    else
      tasks = Task.list(@list.id)
      @el.append  "<div class='message'>" + $.i18n._("There are no tasks in here.") + "</div>"



    # Sorting tasks
    if list.id == "all" or Setting.sortMode()
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
        task.notesplaceholder = $.i18n._ "Notes"
        task.dateplaceholder = $.i18n._ "Due Date"

        task.dateValue = Task.prettyDate(new Date(task.date)).words
        task.dateClass = Task.prettyDate(new Date(task.date)).className

        # Append html
        html = @template(task) + html

    else
      for task in tasks
        # Translations
        task.notesplaceholder = $.i18n._("Notes")
        task.dateplaceholder = $.i18n._("Due Date")

        html = @template(task) + html

    @tasks[0].innerHTML = html

    @timers.bindTasks = setTimeout =>
      for task in tasks
        view = new TaskItem
          task: task
          el: @tasks.find("#task-#{ task.id }")
        @items[@items.length] = view
    , 300

    # Handles Empty List
    @el.addClass "empty" if tasks.length == 0

    # Focuses Thing if not on a touchscreen (virtual keyboard)
    @input.focus() if !is_touch_device()

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
        notes: ""
        date: dateDetector.parse(val)
        priority: (->
          if val.indexOf("#high") >= 0 then return 3
          if val.indexOf("#medium") >= 0 then return 2
          return 1
        )()
      @input.val ""

  # ------------
  # COLLAPSE ALL
  # ------------

  collapseAll: ->
    if !List.current.disabled
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

  scrollbars: (e) =>
    target = $(e.currentTarget)
    target.addClass("show")

    clearTimeout(@scrollbarTimeout)
    @scrollbarTimeout = setTimeout ->
      target.removeClass("show")
    , 1000


module.exports = Tasks
