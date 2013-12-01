Base    = require 'base'
Modal   = require '../views/modal/destroy_task'
List    = require '../models/list'
setting = require '../models/setting'
keys    = require '../utils/keys'
delay   = require '../utils/timer'
translate = require '../utils/translate'
event   = require '../utils/event'

class TaskItem extends Base.View

  elements:
    '.name'         : 'name'
    '.date'         : 'date'
    'time'          : 'time'

  events: Base.touchify
    'click .checkbox'            : 'toggleCompleted'
    'click .tag'                 : 'tagClick'
    'click'                      : 'expand'

  constructor: ->
    super

    # @notes.autosize
    #   resizeDelay: false
    #   append: '\n'

    # @notes.css 'height', '0px'

    @el[0].task = @task
    @expanded = false

    @listen @task,
      'destroy': @release
      'change:listId': @release
      'change:name': @updateName
      'change:priority': @updatePriority
      'change:completed': @updateCompleted

  release: =>
    super
    delete @el
    delete @task

  # ----------------------------------------------------------------------------
  # EXPAND / COLLAPSE
  # ----------------------------------------------------------------------------

  # Expand the task
  expand: (e) =>
    return if @expanded
    return if e.metaKey or e.ctrlKey

    @trigger 'select'
    @expanded = true

  # Collapse the task
  collapse: =>
    return unless @expanded
    @expanded = false

  # ----------------------------------------------------------------------------
  # COMPLETED
  # ----------------------------------------------------------------------------

  toggleCompleted: (e) =>

    # Prevent note expanding
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

  # ----------------------------------------------------------------------------
  # TAGS
  # ----------------------------------------------------------------------------

  tagClick: (e) =>
    e.stopPropagation()
    tag = $(e.currentTarget).text()
    event.trigger 'search', tag

module.exports = TaskItem
