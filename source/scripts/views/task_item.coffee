Base    = require 'base'
event   = require '../utils/event'
tags    = require '../utils/tags'
ExpandedTaskItem = require '../views/task_item_expanded'
Mouse = require '../utils/mouse'

class TaskItem extends Base.View

  ui:
    name: '.name'
    date: '.date'
    time: 'time'

  events: Base.touchify
    'mousedown .checkbox' : 'toggleCompleted'
    'mousedown .tag'      : 'tagClick'
    'mouseup'             : 'expand'

  constructor: ->
    super

    # Link element to task
    @el[0].task = @task

    @expanded = false

    @listen @task,
      'destroy': @release
      'change:date': @updateDate
      'change:listId': @updateList
      'change:name': @updateName
      'change:priority': @updatePriority
      'change:completed': @updateCompleted

  # Remove view when the task is moved to another list
  updateList: =>
    @release()


  # TODO: Bind View.release in the Base framework
  release: =>
    super

  # ---------------------------------------------------------------------------
  # EXPAND / COLLAPSE
  # ---------------------------------------------------------------------------

  # Expand the task
  expand: (e) =>
    if Mouse.tasks.isMoving() or @el[0].selected
      return
    if e.ctrlKey or e.metaKey
      return
    if @disableExpanding
      @disableExpanding = false
      return
    @trigger 'select'
    @el.hide()
    @expandedView = new ExpandedTaskItem
      original: @el
      task: @task

  # Collapse the task
  collapse: =>
    @expandedView.collapse()
    @expandedView.on 'collapse', =>
      @el.show()

  # ---------------------------------------------------------------------------
  # CHANGING VALUES
  # ---------------------------------------------------------------------------

  toggleCompleted: (e) =>

    # Prevent note expanding
    @disableExpanding = true
    e.stopPropagation()

    # Does not work in completed list
    @task.toggleCompleted()

    # TODO: Move into a model/controller
    # if false # List.current.id is 'completed'

    #   # Clones List
    #   order = @task.list().tasks.slice()

    #   # Checks if it hasn't been moved
    #   if order.indexOf(@task.id) is -1
    #     order.push(@task.id)
    #     @task.list().tasks = order

    # else if false # setting.moveCompleted is 0
    #   task.list().moveCompleted()
    #   settings.moveCompleted()
    #   @el.remove()

  updateCompleted: =>
    @el.toggleClass 'completed', !! @task.completed

  updatePriority: =>
    @el.removeClass('p1 p2 p3')
    @el.addClass('p' + @task.priority)

  updateName: =>
    @ui.name.html tags @task.name

  updateDate: (date) =>
    if date?
      date = @task.prettyDate()
      @ui.time.text date.words
      @ui.time.attr 'class', date.classname
      @ui.date.removeClass 'hidden'
    else
      @ui.time.text ''
      @ui.date.addClass 'hidden'

  # ---------------------------------------------------------------------------
  # TAGS
  # ---------------------------------------------------------------------------

  tagClick: (e) =>
    e.stopPropagation()
    tag = $(e.currentTarget).text()
    event.trigger 'search', tag

module.exports = TaskItem
