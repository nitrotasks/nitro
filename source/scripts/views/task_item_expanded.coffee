Base    = require 'base'
DeleteModal   = require '../views/modal/destroy_task'
List    = require '../models/list'
setting = require '../models/setting'
keys    = require '../utils/keys'
translate = require '../utils/translate'
delay = require '../utils/timer'

# Constants
DURATION = 150
TEXT = {}
CLASSNAME =
  expanded: 'expanded'
  completed: 'completed'
  placeholder: 'placeholder'

translate.ready ->
  TEXT = translate
    notes: 'Notes'

class ExpandedTaskItem extends Base.View

  template: require '../templates/task_expanded'

  elements:
    '.input-name'   : 'name'
    '.input-date'   : 'date'
    '.notes'        : 'notes'

  events: Base.touchify
    'click .checkbox'            : 'toggleCompleted'
    'blur .input-name'           : 'endEdit'
    'keypress .input-name'       : 'endEditOnEnter'
    'focus .notes'               : 'notesEdit'
    'blur .notes'                : 'notesSave'
    'change .input-date'         : 'datesSave'
    'mousedown': 'mousedown'

  mousedown: (e) ->
    e.stopPropagation()

  constructor: ->
    super

    @bind $ @template @task
    @el.insertAfter @original

    requestAnimationFrame =>
      @expand()

    @notes.autosize
      resizeDelay: false
      append: '\n'

    @notes.css 'height', '0px'

    @el[0].task = @task
    @expanded = false

    @setupDatepicker()

    @listen @task,
      'destroy': @release
      'change:listId': @updateList
      'change:name': @updateName
      'change:priority': @updatePriority
      'change:completed': @updateCompleted

  setupDatepicker: =>

    @date.datepicker
      firstDay: setting.weekStart
      dateFormat: setting.dateFormat

    if @task.date
      @date.datepicker('setDate', @task.date)

  # Delete Button
  remove: =>
    DeleteModal.run @task

  # Remove view when the task is moved to another list
  updateList: =>
    @release()

  # ---------------------------------------------------------------------------
  # EXPAND / COLLAPSE
  # ---------------------------------------------------------------------------

  # Expand the task
  expand: (e) =>
    return if @expanded
    @expanded = true
    @el.addClass CLASSNAME.expanded
    @notes.trigger 'autosize.resize'
    @name.focus()

  # Collapse the task
  collapse: =>
    return unless @expanded
    @expanded = false
    @el.removeClass CLASSNAME.expanded
    @notes.css 'height', '0px'
    delay DURATION, =>
      @release()
      @trigger 'collapse'

  # ---------------------------------------------------------------------------
  # COMPLETED
  # ---------------------------------------------------------------------------

  toggleCompleted: (e) =>

    # Prevent note expanding
    e.stopPropagation()

    # Does not work in completed list
    if @task.completed is false
      @task.completed = new Date().getTime()
    else
      @task.completed = false

  updateCompleted: =>
    @el.toggleClass CLASSNAME.completed, @task.completed

  # ---------------------------------------------------------------------------
  # PRIORITIES
  # ---------------------------------------------------------------------------

  updatePriority: =>
    @el
      .removeClass('p1 p2 p3')
      .addClass('p' + @task.priority)

  # ---------------------------------------------------------------------------
  # NAME
  # ---------------------------------------------------------------------------

  endEdit: =>
    val = @name.val()
    if val.length
      @task.name = val
    else
      @task.destroy()

  endEditOnEnter: (e) =>
    if e.which is keys.enter
      @name.blur()

  updateName: =>
    @name.val @task.name

  # ---------------------------------------------------------------------------
  # NOTES
  # ---------------------------------------------------------------------------

  notesEdit: =>
    if @notes.text() is TEXT.notes
      @notes.text ''
    @notes.removeClass CLASSNAME.placeholder

  notesSave: =>
    text = @notes.val()
    if text is ''
      @notes.text TEXT.notes
      @notes.addClass CLASSNAME.placeholder
    @task.notes = text

  # ---------------------------------------------------------------------------
  # DATES
  # ---------------------------------------------------------------------------

  datesSave: =>

    if @date.val().length
      @task.date = @date.datepicker('getDate').getTime()

    else
      @task.date = null


module.exports = ExpandedTaskItem
