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
    @task.bind 'update', @update
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

  update: =>
    @name.text @task.name
    @el.toggleClass "completed", @task.completed

  # Delete Button
  remove: ->
    @task.destroy()

  toggleStatus: ->
    @task.completed = !@task.completed
    @task.save()

  startEdit: ->
    @el.addClass("expanded")
    # @el.draggable({ disabled: true })
    @name.attr("contenteditable", "true")
    @name.focus()

  endEdit: ->
    # @name.removeAttr("contenteditable")
    # @el.draggable({ disabled: false })
    val = @name.text()
    if val then @task.updateAttribute("name", val) else @task.destroy()

  endEditOnEnter: (e) =>
    if e.which is ENTER_KEY
      e.preventDefault()
      @name.blur()

module.exports = TaskItem
