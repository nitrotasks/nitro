Spine = require('spine')
List  = require('models/list')
Keys  = require("utils/keys")
$     = Spine.$

class TaskItem extends Spine.Controller

  elements:
    '.name': 'name'
    '.date': 'date'
    '.notes .inner': 'notes'

  events:
    'click .delete': 'remove'
    'click .priority-button div': 'setPriority'
    'click .checkbox': 'toggleStatus'
    'click .tag': 'tagClick'

    # Editing the actual task
    'click': 'expand'
    'blur .name': 'endEdit'
    'keypress .name': 'endEditOnEnter'

    # Make notes editable
    'focus .notes': 'notesEdit'
    'blur .notes': 'notesSave'
    'change .date': 'datesSave'


  constructor: ->
    super
    throw "@task required" unless @task
    @task.bind 'update', @update
    @task.bind 'destroy', @release
    @render()

  render: =>

    # Bind datepicker
    @date.datepicker()
    @date.datepicker("setDate", new Date(@task.date)) if @task.date

  update: (task) =>
    # Remove task if it isn't in the current list
    if List.current.id isnt "all" and List.current.id isnt "filter" and task.list isnt List.current.id
      @release()

    # Set completed
    @el.toggleClass "completed", @task.completed

    # Makes tags clickable
    @name.html @task.name.replace(/#(\w+)/g, ' <span class="tag">#$1</span>')

    # Set priority
    @el.removeClass("p0 p1 p2 p3").addClass("p" + @task.priority)

  # Delete Button
  remove: ->
    @task.destroy()

  toggleStatus: ->
    @task.completed = !@task.completed
    @task.save()

  expand: (e) ->
    if e.target.className isnt "checkbox"
      @el.parent().find(".expanded").removeClass("expanded")
      @el.addClass("expanded animout")
      @el.draggable({ disabled: true })

      notes = @notes.parent()
      setTimeout (->
        notes.addClass("auto")
      ), 300


  # ----------------------------------------------------------------------------
  # PRIORITIES
  # ----------------------------------------------------------------------------

  setPriority: (e) ->
    priority = $(e.target).data('id')
    @task.updateAttribute "priority", priority


  # ----------------------------------------------------------------------------
  # NAME
  # ----------------------------------------------------------------------------

  endEdit: ->
    val = @name.text()
    if val then @task.updateAttribute("name", val) else @task.destroy()

  endEditOnEnter: (e) =>
    if e.which is Keys.ENTER
      e.preventDefault()
      @name.blur()


  # ----------------------------------------------------------------------------
  # NOTES
  # ----------------------------------------------------------------------------

  notesEdit: =>
    if @notes.text() is "Notes" then @notes.text("")
    @notes.parent().removeClass("placeholder")

  notesSave: =>
    text = @notes.text()
    if text is ""
      @notes.text("Notes")
      @notes.parent().addClass("placeholder")
    else
      @task.updateAttribute "notes", text

  # ----------------------------------------------------------------------------
  # DATES
  # ----------------------------------------------------------------------------
  datesSave: =>
    @task.updateAttribute "date", new Date(@date.val()).getTime()

  # ----------------------------------------------------------------------------
  # TAGS
  # ----------------------------------------------------------------------------

  tagClick: (e) =>
    # Stop task from expanding
    e.stopPropagation()
    List.trigger "changeList",
      name: "Tagged with " + $(e.currentTarget).text()
      id: "filter"
      tasks: Task.tag($(e.currentTarget).text().substr(1))
      disabled: yes
      permanent: yes


module.exports = TaskItem
