Base         = require 'base'
Lists        = require '../views/lists'
TaskItem     = require '../views/task_item'
Task         = require '../models/task'
List         = require '../models/list'
Setting      = require '../models/setting'
keys         = require '../utils/keys'
dateDetector = require '../utils/date'
delay        = require '../utils/timer'
isMobile     = require '../utils/touch'

DURATION = 150 #ms

class Tasks extends Base.View

  el: '.main'

  template:
    item:     require '../templates/task'
    group:    require '../templates/group'
    message: require '../templates/tasks'

  ui:
    tasks: '.tasks-container ul'
    input: '.task-input'
    message: '.message'
    entrance: '.entrance'
    datepickerwrap: '.datepicker-wrapper'

  events: Base.touchify
    'click': 'collapseOnClick'
    'keydown .task-input': 'keydown'
    'keyup .task-input': 'keyup'
    'click .datepicker-wrapper': 'hideDatepicker'

  constructor: ->
    super

    # Store currently loaded tasks
    @views = []
    @timers = {}

    @currentTask = null
    @search = no # all, active, completed

    # It's one line of code George, don't hate.
    $(".datepicker-container").datepicker()

    @listen [
      Task,
        'refresh': @refresh
        'create:model': @addOne
      List,
        'select:model': @render
      Setting,
        'change:sort': @refresh
    ]

  # Datepicker
  hideDatepicker: (e, opts) =>
    if opts is true or !$.contains(this, e.target)
      @ui.datepickerwrap.removeClass 'show'

  # ---------------------------------------------------------------------------
  # TASK EVENTS
  # ---------------------------------------------------------------------------

  # Listen to events on the task item view
  bindTask: (view) =>
    view.on 'select', =>
      # Collapse the last open view
      @collapse()
      @currentTask = view

  # Remove event listeners
  releaseTask: (view) =>
    view.off 'select'

  # ---------------------------------------------------------------------------
  # DISPLAYING TASKS
  # ---------------------------------------------------------------------------

  # Render the current list
  refresh: =>
    if Lists.active then @render Lists.active

  # Add a single task to the DOM
  addOne: (task) =>
    # Add to dom
    @ui.tasks.prepend @template.item task

    # Create a new view
    view = new TaskItem
      el: @ui.tasks.find '#task-' + task.id
      task: task

    # Bind events
    @bindTask view
    @views.push view

    # TODO: Set up a method for this
    @el.removeClass 'empty'


  # Display a list of tasks
  render: (list, animated=false) =>

    @hideDatepicker(null, true)

    # HANDLE ANIMATIONS
    if not animated
      @ui.entrance.addClass 'exitPage'
      delay DURATION, =>
        @render(list, true)
      return

    # Search for tasks
    if list.id is 'search'

      @ui.message.text @template.message.special
      if list.query? then @ui.input.val list.query
      @toggleSearch list

      # toggleSearch will display the results for us
      return

    # If we were in search mode before, but the list isn't search
    # then turn off search mode
    else if @search
      @toggleSearch off

    # Standard list
    if list.tasks.length
      @ui.message.text @template.message.standard

    # Empty list
    else
      @ui.message.text @template.message.empty

    if Setting.sort
      tasks = list.tasks.sort()
    else
      tasks = list.tasks

    # Display tasks
    @displayTasks tasks

    # Handles Empty List
    @el.toggleClass 'empty', tasks.length is 0


  displayTasks: (tasks, disableAnimation=no) =>

    @ui.entrance.removeClass('exitPage')

    unless disableAnimation
      @ui.entrance.addClass('enterPage')

    # Keep a copy of the old views
    oldViews = @views
    @views = []

    # Unbind existing tasks
    delay 1000, =>
      for item in oldViews
        @releaseTask item
        item.release()
      oldViews = []

    # Holds html
    html = ''

    # Sorting tasks
    if Setting.sort

      first = tasks[0]

      if first
        {priority, completed} = first

      tasks.forEach (task) =>

        # Add seperator if it is completed and the last one wasn't
        if not completed and task.completed
          completed = true
          group = yes

        # Add seperator if it is a different priority to the last one
        else if not completed and task.priority isnt priority
          group = yes

        # Append html
        html += @template.group if group
        html += @template.item task

        # Reset values
        group = no
        priority = task.priority


    # Not sorting
    else

      tasks.forEach (task) =>
        html += @template.item task

        # TODO: Add this back in a sane way
        # if list.id is 'all' then task.listName = task.list().name

    # Render html
    @ui.tasks[0].innerHTML = html

    render = =>

      # Fade out animated stuff
      @ui.entrance.removeClass 'enterPage'
      # @focus() unless isMobile

      # Connect each task to the actual element
      tasks.forEach (task) =>

        view = new TaskItem
          task: task
          el: @ui.tasks.find '#task-' + task.id

        @bindTask view
        @views.push view

    if disableAnimation
      render()
    else
      delay DURATION, render


  # -------------
  # INPUT HANDLER
  # -------------

  focus: =>
    @ui.input.focus()

  # Handle keydown events on the input box
  keydown: (e) =>
    return if @search
    if e.keyCode is keys.enter and @ui.input.val().length > 0
      @createNewTask()

  # Handle keyup events on the input box
  keyup: (e) =>
    if @search then @updateSearchResults()

  # Create a new task
  createNewTask: =>
    name = @ui.input.val()
    @ui.input.val ''
    Task.create
      name: name
      listId: Lists.active.id
      date: dateDetector.parse name


  # --------------
  # SEARCH RESULTS
  # --------------

  # Toggles the input box text
  toggleSearch: (@search) =>
    if @search
      @updateSearchResults(no)
      message = @template.message.search
    else
      message = @template.message.addTask

    @ui.input.toggleClass 'search', !! @search
    @ui.input.attr 'placeholder', message

  updateSearchResults: (disableAnimation=yes) =>
    results = Task.search @ui.input.val(), @search.type
    if @search.sort then results = Task.sort results
    @displayTasks results, disableAnimation
    @el.toggleClass 'empty', results.length is 0


  # ------------------
  # COLLAPSE ALL TASKS
  # ------------------

  collapse: =>
    @hideDatepicker(null, true)
    @currentTask.collapse() if @currentTask

  # Collapsing of tasks
  collapseOnClick: (e) =>
    target = e.target
    if target.className is 'main tasks' or target.nodeName is 'UL'
      @collapse()

module.exports = Tasks
