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
    '.input-name'   : 'inputName'
    '.date'         : 'date'
    '.notes'        : 'notesParent'
    '.notes .inner' : 'notes'
    'time'          : 'time'

  events:
    'click .delete'              : 'remove'
    'click .priority-button div' : 'setPriority'
    'click .checkbox'            : 'toggleCompleted'
    'click .tag'                 : 'tagClick'

    # Editing the actual task
    'click'                      : 'expand'
    'blur .input-name'           : 'endEdit'
    'keypress .input-name'       : 'endEditOnEnter'

    # Make notes editable
    'focus .notes'               : 'notesEdit'
    'blur .notes'                : 'notesSave'
    'change .date'               : 'datesSave'


  constructor: ->
    Base.touchify(@events)
    super

    @expanded = false

    @listen @task,
      'destroy': @release
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

  # ----------------------------------------------------------------------------
  # EXPAND / COLLAPSE
  # ----------------------------------------------------------------------------

  # Expand the task
  expand: (e) =>
    if not @expanded
      @trigger 'select'
      @expanded = true
      @inputName.val @task.name
      @el.addClass('expanded animout')

      # TODO: Fix
      # Disable sortable and draggable
      # @el.draggable({ disabled: true })
      # @el.parent().sortable({ disabled: true })

      notes = @notes.parent()
      delay 300, ->
        notes.addClass 'auto'

  # Collapse the task
  collapse: =>
    if @expanded
      @expanded = false
      @el.removeClass('expanded')

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
      order = List.get(@task.list).tasks.slice(0)

      # Checks if it hasn't been moved
      if order.indexOf(@task.id) is -1
        order.push(@task.id)
        List.get(@task.list).tasks = order

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
    @notesParent.removeClass 'placeholder'

  notesSave: =>
    text = @notes.html()
    if text is ''
      @notes.text translate 'Notes'
      @notesParent.addClass 'placeholder'
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
    # Stop task from expanding
    e.stopPropagation()

    # TODO: Replace this with a tag event
    # tag = $(e.currentTarget).text()
    # event.trigger 'open:tag', tag

    tag = $(e.currentTarget).text()
    console.log Task.tag tag



    # List.trigger 'change:current',
    #   name: 'Tagged with ' + $(e.currentTarget).text()
    #   id: 'search'
    #   tasks: Task.tag($(e.currentTarget).text().substr(1))
    #   disabled: yes
    #   permanent: yes


module.exports = TaskItem
