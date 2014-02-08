Base        = require 'base'
DeleteModal = require '../views/modal/destroy_task'
List        = require '../models/list'
Pref        = require '../models/pref'
keys        = require '../utils/keys'
translate   = require '../utils/translate'
delay       = require '../utils/delay'
Time        = require '../utils/time'

# Constants
DURATION = 150
CLASSNAME =
  expanded: 'expanded'
  completed: 'completed'
  placeholder: 'placeholder'
TEXT = translate
  notes: 'Notes'

class ExpandedTaskItem extends Base.View

  template: require '../templates/task_expanded'

  ui:
    name: '.input-name'
    date: '.input-date'
    notes: '.notes'

  events: Base.touchify
    'click .checkbox'            : 'toggleCompleted'
    'blur .input-name'           : 'endEdit'
    'keypress .input-name'       : 'endEditOnEnter'
    'focus .notes'               : 'notesEdit'
    'blur .notes'                : 'notesSave'
    'click .priority-toggle'     : 'togglePriority'
    'click .input-date'          : 'datesOpen'
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

    @ui.notes.autosize
      resizeDelay: false
      append: '\n'

    @ui.notes.css 'height', '0px'

    @el[0].task = @task
    @expanded = false

    @ui.dateCont = $(".datepicker-wrapper")
    @ui.dateWrap = $(".datepicker-container")
    @setupDatepicker()

    @listen @task,
      'destroy': @release
      'change:listId': @updateList
      'change:name': @updateName
      'change:priority': @updatePriority
      'change:completed': @updateCompleted

  setupDatepicker: =>

    @ui.dateWrap.datepicker 'option',
      firstDay: Pref.weekStart
      dateFormat: Pref.dateFormat
      onSelect: =>
        @datesSave()

    if @task.date
      @ui.dateWrap.datepicker 'option',
        altField: @ui.date
      @ui.dateWrap.datepicker('setDate', Time.toDate(@task.date))

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
    @ui.notes.trigger 'autosize.resize'
    @ui.name.focus()

  # Collapse the task
  collapse: =>
    return unless @expanded
    @expanded = false
    @el.removeClass CLASSNAME.expanded
    @ui.notes.css 'height', '0px'
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

  togglePriority: =>
    if @task.priority is 3
      @task.priority = 1
    else
      @task.priority++

  updatePriority: =>
    @el
      .removeClass('p1 p2 p3')
      .addClass('p' + @task.priority)

  # ---------------------------------------------------------------------------
  # NAME
  # ---------------------------------------------------------------------------

  endEdit: =>
    val = @ui.name.val()
    if val.length
      @task.name = val
    else
      @task.destroy()

  endEditOnEnter: (e) =>
    if e.which is keys.enter
      @ui.name.blur()

  updateName: =>
    @ui.name.val @task.name

  # ---------------------------------------------------------------------------
  # NOTES
  # ---------------------------------------------------------------------------

  notesEdit: =>
    if @ui.notes.text() is TEXT.notes
      @ui.notes.text ''
    @ui.notes.removeClass CLASSNAME.placeholder

  notesSave: =>
    text = @ui.notes.val()
    if text is ''
      @ui.notes.text TEXT.notes
      @ui.notes.addClass CLASSNAME.placeholder
    @task.notes = text

  # ---------------------------------------------------------------------------
  # DATES
  # ---------------------------------------------------------------------------

  datesOpen: (e) =>
    @ui.dateCont.addClass('show')
    @ui.dateWrap.css {top: ($($(e.currentTarget).parents().get(1)).position().top) + 50}
    @ui.dateWrap.datepicker 'option',
      altField: @ui.date

  datesSave: =>

    if @ui.date.val().length
      @task.date = Time.from @ui.dateWrap.datepicker('getDate').getTime()

    else
      @task.date = 0


module.exports = ExpandedTaskItem
