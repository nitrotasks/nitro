Base    = require 'base'
Modal   = require '../views/modal/destroy_task'
List    = require '../models/list'
setting = require '../models/setting'
keys    = require '../utils/keys'
delay   = require '../utils/timer'
translate = require '../utils/translate'
event   = require '../utils/event'

class ExpandedTaskItem extends Base.View

  elements:
    '.name'         : 'name'
    '.input-name'   : 'inputName'
    '.date'         : 'date'
    '.notes'        : 'notes'
    'time'          : 'time'

  events: Base.touchify
    'click .delete'              : 'remove'
    'click .priority-button div' : 'setPriority'
    'click .checkbox'            : 'toggleCompleted'
    'click .tag'                 : 'tagClick'

    # Editing the actual task
    'click'                      : 'expand'
    'blur .input-name'           : 'endEdit'task.list().tasks.slice()

      # Checks if it hasn't been moved
      if order.indexOf(@task.id) is -1
        order.push(@task.id)
        @task.list().tasks = order

    else if false # setting.completedDuration is 'instant'
      settings.moveCompleted()
      @el.remove()
    'keypress .input-name'       : 'endEditOnEnter'

    # Make notes editable
    'focus .notes'               : 'notesEdit'
    'blur .notes'                : 'notesSave'
    'change .date'               : 'datesSave'

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
    Modal.run @task

  # Remove this view
  release: =>
    @unbind()
    @el.remove()

  updateList: =>
    @release()

  # ----------------------------------------------------------------------------
  # EXPAND / COLLAPSE
  # ----------------------------------------------------------------------------

  # Expand the task
  expand: (e) =>
    if not @expanded
      @trigger 'select'
      @expanded = true
      @inputName.val @task.name
      @el.addClass 'expanded'
      @notes.trigger 'autosize.resize'

      # TODO: Fix
      # Disable sortable and draggable
      # @el.draggable({ disabled: true })
      # @el.parent().sortable({ disabled: true })

      # notes = @notes.parent()
      # delay 300, ->
      #   notes.addClass 'auto'

  # Collapse the task
  collapse: =>
    if @expanded
      @expanded = false
      @el.removeClass 'expanded'
      @notes.css 'height', '0px'

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
    if false # List.current.id is 'completed'

      # Clones List
      order = @task.list().tasks.slice()

      # Checks if it hasn't been moved
      if order.indexOf(@task.id) is -1
        order.push(@task.id)
        @task.list().tasks = order

    else if false # setting.completedDuration is 'instant'
      settings.moveCompleted()
      @el.remove()

  updateCompleted: =>
    @el.toggleClass 'completed', @task.completed

  # ----------------------------------------------------------------------------
  # PRIORITIES
  # ----------------------------------------------------------------------------

  setPriority: (e) =>
    priority = $(e.target).data('id')
    @task.priority = priority

  updatePriority: =>
    @el
      .removeClass('p1 p2 p3')
      .addClass('p' + @task.priority)

  # ----------------------------------------------------------------------------
  # NAME
  # ----------------------------------------------------------------------------

  endEdit: =>
    val = @inputName.val()
    if val.length
      @task.name = val
    else
      @task.destroy()

  endEditOnEnter: (e) =>
    if e.which is keys.enter
      # e.preventDefault()
      @inputName.blur()

  updateName: =>
    @name.html @task.name
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/#(\w+)/g, ' <span class="tag">#$1</span>')

  # ----------------------------------------------------------------------------
  # NOTES
  # ----------------------------------------------------------------------------

  notesEdit: =>
    if @notes.text() is translate 'Notes'
      @notes.text ''
    @notes.removeClass 'placeholder'

  notesSave: =>
    text = @notes.val()
    if text is ''
      @notes.text translate 'Notes'
      @notes.addClass 'placeholder'
    else
      @task.notes = text

  # ----------------------------------------------------------------------------
  # DATES
  # ----------------------------------------------------------------------------

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

  # ----------------------------------------------------------------------------
  # TAGS
  # ----------------------------------------------------------------------------

  tagClick: (e) =>
    e.stopPropagation()
    tag = $(e.currentTarget).text()
    event.trigger 'search', tag

module.exports = ExpandedTaskItem
