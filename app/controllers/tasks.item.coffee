Spine   = require('spine')
List    = require('models/list')
Setting = require("models/setting")
Keys    = require("utils/keys")
$       = Spine.$

class TaskItem extends Spine.Controller

  elements:
    '.name': 'name'
    '.input-name': 'inputName'
    '.date': 'date'
    '.notes .inner': 'notes'
    'time': 'time'

  events:
    'click .delete': 'remove'
    'click .priority-button div': 'setPriority'
    'click .checkbox': 'toggleStatus'
    'click .tag': 'tagClick'

    # Editing the actual task
    'click': 'expand'
    'blur .input-name': 'endEdit'
    'keypress .input-name': 'endEditOnEnter'

    # Make notes editable
    'focus .notes': 'notesEdit'
    'blur .notes': 'notesSave'
    'change .date': 'datesSave'


  constructor: ->
    super
    throw "@task required" unless @task
    @task.bind 'update', @update
    @task.bind 'destroy', @release
    @task.bind 'destroy', @listWarning
    @render()

  render: =>

    # Bind datepicker
    @date.datepicker
      firstDay: Setting.get("weekStart")
      dateFormat: Setting.get("dateFormat")
    @date.datepicker("setDate", new Date(@task.date)) if @task.date

  update: (task) =>
    # Remove task if it isn't in the current list
    if List.current.id isnt "all" and List.current.id isnt "filter" and task.list isnt List.current.id
      @release()

    # Set completed
    @el.toggleClass "completed", @task.completed

    # Makes tags clickable
    @name.html @task.name.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/#(\w+)/g, ' <span class="tag">#$1</span>')

    # Set priority
    @el.removeClass("p0 p1 p2 p3").addClass("p" + @task.priority)

  # Delete Button
  remove: ->
    if Setting.get "confirmDelete"
      $(".modal.delete").modal "show"
      $(".modal.delete .true").on("click", =>
        @task.destroy()
        $(".modal.delete").modal "hide"
        $(".modal.delete .true").off "click"
      )

      $(".modal.delete .false").on("click", (e) ->
        $(".modal.delete").modal "hide"
        $(".modal.delete .false").off "click"
      )
    else
      @task.destroy()

  listWarning: ->
    $('.main.tasks').addClass('empty') if $("ul.tasks").children().length == 0

  release: ->
    # Remove model listeners
    @task.unbind 'update', @update
    @task.unbind 'destroy', @release
    super

  toggleStatus: =>
      # Does not work in completed list
      @task.completed = !@task.completed
      @task.save()

      if List.current.id is "completed"

        # Clones List
        order = List.find(@task.list).tasks.slice(0)

        # Checks if it hasn't been moved
        if order.indexOf(@task.id) is -1
          order.push(@task.id)
          List.find(@task.list).updateAttribute("tasks", order)

      else if Setting.get("completedDuration") is "instant"
        settings.moveCompleted()
        @el.remove()

  expand: (e) ->
    if not @el.hasClass("expanded") and e.target.className isnt "checkbox"
      @el.parent()
        .find(".expanded")
        .removeClass("expanded")
      @inputName.val @task.name
      @el.addClass("expanded animout")

      # Disable sortable and draggable
      @el.draggable({ disabled: true })
      @el.parent().sortable({ disabled: true })

      notes = @notes.parent()
      setTimeout ( =>
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
    val = @inputName.val()
    if val then @task.updateAttribute("name", val) else @task.destroy()

  endEditOnEnter: (e) =>
    if e.which is Keys.ENTER
      e.preventDefault()
      @inputName.blur()

  # ----------------------------------------------------------------------------
  # NOTES
  # ----------------------------------------------------------------------------

  notesEdit: =>
    if @notes.text() is $.i18n._("Notes") then @notes.text("")
    @notes.parent().removeClass("placeholder")

  notesSave: =>
    text = @notes.html()
    if text is ""
      @notes.text($.i18n._("Notes"))
      @notes.parent().addClass("placeholder")
    else
      @task.updateAttribute "notes", text

  # ----------------------------------------------------------------------------
  # DATES
  # ----------------------------------------------------------------------------
  datesSave: =>

    if @date.val().length > 0
      @task.updateAttribute "date", @date.datepicker("getDate").getTime()
      @el.find("img").css('display', 'inline-block')

      # Pretty Dates Engine
      @time.text Task.prettyDate(new Date(@task.date)).words
      @time.attr "class", Task.prettyDate(new Date(@task.date)).className
    else
      @task.updateAttribute "date", ""
      @el.find("img").removeAttr('style')
      @time.text ""

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
