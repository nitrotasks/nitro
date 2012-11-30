Spine = require('spine')
List = require('models/list')
$ = Spine.$

class TaskItem extends Spine.Controller
  template: require('views/task')
  ENTER_KEY = 13
  ESCAPE_KEY = 27

  elements:
    'input.name': 'input'

  events:
    'click .delete': 'remove'
    'click .checkbox': 'toggleStatus'
    "dblclick": "edit"
    "blur input": "finishEdit"
    "keyup input": "finishEditOnEnter"
    "click .buttons a": "menuClick"

  constructor: ->
    super
    throw "@task required" unless @task
    @task.bind 'update', @render
    @task.bind 'destroy', @release
    @task.bind 'change', @change

  render: =>
    @replace @template @task
    @el.draggable
      revert: "invalid"
      revertDuration: 200
      distance: 10
      scroll: false
      cursorAt:
        top: 15
        right: 30
      helper: =>
        $("body").append("<div class=\"helper\">#{ @task.name }</div>")
        $(".helper")
    @

  edit: =>
    @el.addClass "edit"
    @input.val(@task.name).focus()

  finishEdit: ->
    @el.removeClass "edit"
    val = @input.val()
    if val then @task.updateAttribute("name", val) else @task.destroy()

  finishEditOnEnter: (e) ->
    switch e.which
      when ENTER_KEY then @input.blur()
      when ESCAPE_KEY
        @input.val @task.name
        @input.blur()

  # Remove task if it is no longer in the current list
  change: (task) =>
    if List.current.id isnt "all" and task.list isnt List.current.id
      @release()

  remove: ->
    @task.destroy()

  toggleStatus: ->
    @task.completed = !@task.completed
    @task.save()

  menuClick: ->
    console.log("JELLO")

module.exports = TaskItem
