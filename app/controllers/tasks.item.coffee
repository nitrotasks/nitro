Spine = require('spine')
List = require('models/list')
$ = Spine.$

class TaskItem extends Spine.Controller
  template: require('views/task')
  ENTER_KEY = 13
  ESCAPE_KEY = 27

  elements:
    '.name': 'name'

  events:
    'click .delete': 'remove'
    'click .checkbox': 'toggleStatus'

    # Editing the actual task
    'click .name': 'startEdit'
    'blur .name': 'endEdit'
    'keypress .name': 'endEditOnEnter'

  constructor: ->
    super
    throw "@task required" unless @task
    @task.bind 'update', @render
    @task.bind 'destroy', @release
    @task.bind 'change', @change

  render: =>
    @replace @template @task
    # @el.draggable
    #   revert: "invalid"
    #   revertDuration: 200
    #   distance: 10
    #   scroll: false
    #   cursorAt:
    #     top: 15
    #     right: 30
    #   helper: =>
    #     $("body").append("<div class=\"helper\">#{ @task.name }</div>")
    #     $(".helper")
    @

  # Remove task if it is no longer in the current list
  change: (task) =>
    if List.current.id isnt "all" and task.list isnt List.current.id
      @release()

  # Delete Button
  remove: ->
    @task.destroy()

  toggleStatus: ->
    @task.completed = !@task.completed
    @task.save()

  startEdit: ->
    if not @expanded
      @expanded = yes
      @el.addClass("expanded")
      # @el.draggable({ disabled: true })
      @el.append("<div class=\"notes\"></div>")
      @name.attr("contenteditable", "true")
      @name.focus()

  endEdit: ->
    # @name.removeAttr("contenteditable")
    # @el.draggable({ disabled: false })
    @expanded = no
    val = @name.text()
    if val then @task.updateAttribute("name", val) else @task.destroy()

  endEditOnEnter: (e) =>
    if e.which is ENTER_KEY
      e.preventDefault()
      @name.blur()

module.exports = TaskItem
