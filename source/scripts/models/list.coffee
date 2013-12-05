Base = require 'base'
Local = require '../controllers/local'

class List extends Base.Model

  defaults:
    id: null
    name: ''
    tasks: null

  # Reference active list
  # Should proabably be in a controller
  @current: null

  constructor: ->
    super

    Task = require './task'

    # If @tasks is an array of IDs, convert it into a Task collection
    if @tasks instanceof Array
      taskIds = @tasks
      @tasks = new Task.constructor()
      taskIds.forEach (id) =>
        if Task.exists id
          task = Task.get id
          @tasks.add task, silent: true
        else
          console.log 'could not find task', id

    else if @tasks is null
      @tasks = new Task.constructor()

    @tasks.on 'change', =>
      @trigger 'save'

    @tasks.type = 'minor'

  # Move a task from one list to another
  # - task (Task) : The task to move
  # - list (List) : The list to move the task to
  moveTask: (task, list) =>
    if @id == list.id then return
    task.listId = list.id
    list.tasks.add task
    @tasks.remove task

  # Remove completed tasks from list
  moveCompleted: =>
    @tasks.refresh @tasks.active(), true

  # TODO: Hook up to the before:destroy event
  destroyTasks: =>
    @tasks.each (task) ->
      if task.completed
        task.destroy sync:no
      else
        task.listId = 'inbox'

  toJSON: =>
    id: @id
    name: @name
    tasks: @tasks.pluck 'id'
    permanent: @permanent or no

class ListCollection extends Base.Collection

  className: 'list'

  model: List

  constructor: ->
    super

# Create a new ListCollection to store all the lists
allLists = new ListCollection()

# Add localStorge support
new Local(allLists)

module.exports = allLists
