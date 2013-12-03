Base    = require 'base'
# List    = require '../models/list'
# setting = require '../models/setting'
event   = require '../utils/event'
ExpandedTaskItem = require '../views/task_item_expanded'

class TaskItem extends Base.View

  elements:
    '.name'         : 'name'
    '.date'         : 'date'
    'time'          : 'time'

  events: Base.touchify
    'mousedown .checkbox' : 'toggleCompleted'
    'mousedown .tag'      : 'tagClick'
    'mouseup'             : 'expand'

  constructor: ->
    super

    @el[0].task = @task
    @expanded = false

    @listen @task,
      'destroy': @release
      'change:listId': @updateList
      'change:name': @updateName
      'change:priority': @updatePriority
      'change:completed': @updateCompleted

  # Remove view when the task is moved to another list
  updateList: =>
    @release()

  # ---------------------------------------------------------------------------
  # EXPAND / COLLAPSE
  # ---------------------------------------------------------------------------

  # Expand the task
  expand: (e) =>
    if @el[0].selected or @el[0]._temp_selected
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
  # COMPLETED
  # ---------------------------------------------------------------------------

  toggleCompleted: (e) =>

    # Prevent note expanding
    @disableExpanding = true
    e.stopPropagation()

    # Does not work in completed list
    if @task.completed is false
      @task.completed = new Date().getTime()
    else
      @task.completed = false

    # TODO: Move into a model/controller
    # if false # List.current.id is 'completed'

    #   # Clones List
    #   order = @task.list().tasks.slice()

    #   # Checks if it hasn't been moved
    #   if order.indexOf(@task.id) is -1
    #     order.push(@task.id)
    #     @task.list().tasks = order

    # else if false # setting.completedDuration is 'instant'
    #   settings.moveCompleted()
    #   @el.remove()

  updateCompleted: =>
    @el.toggleClass 'completed', @task.completed

  updatePriority: =>
    @el.removeClass('p1 p2 p3')
    @el.addClass('p' + @task.priority)

  updateName: =>
    @name.html @task.name
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/#(\w+)/g, ' <span class="tag">#$1</span>')

  # ---------------------------------------------------------------------------
  # TAGS
  # ---------------------------------------------------------------------------

  tagClick: (e) =>
    e.stopPropagation()
    tag = $(e.currentTarget).text()
    event.trigger 'search', tag

module.exports = TaskItem
