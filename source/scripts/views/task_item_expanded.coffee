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
    '.date'         : 'date'
    '.notes'        : 'notes'
    'time'          : 'time'

  events: Base.touchify
    'click .checkbox'            : 'toggleCompleted'
    'blur .input-name'           : 'endEdit'
    'keypress .input-name'       : 'endEditOnEnter'
    'focus .notes'               : 'notesEdit'
    'blur .notes'                : 'notesSave'
    'change .date'               : 'datesSave'
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

    @listen @task,
      'destroy': @release
      'change:listId': @updateList
      'change:name': @updateName
      'change:priority': @updatePriority
      'change:completed': @updateCompleted

  render: =>
    # TODO: Setup datepicker
    # Bind datepicker
    # @date.datepicker
    #   firstDay: setting.weekStart
    #   dateFormat: setting.dateFormat
    # @date.datepicker('setDate', new Date(@task.date)) if @task.date

    # @el = $ @template @task
    # @bind()
    return this

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
  # TODO: Fix this
  # ---------------------------------------------------------------------------

  datesSave: =>

    if @date.val().length > 0
      @task.updateAttribute 'date', @date.datepicker('getDate').getTime()
      @el.find('img').css('display', 'inline-block')

      # Pretty Dates Engine
      @time.text Task.prettyDate(new Date(@task.date)).words
      @time.attr 'class', Task.prettyDate(new Date(@task.date)).className

    else
      @task.updateAttribute 'date', ''
      @el.find('img').removeAttr('style')
      @time.text ''


module.exports = ExpandedTaskItem
