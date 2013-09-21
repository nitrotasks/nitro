# Spine
Spine = require 'spine'

# Models
Task  = require './task.coffee'

class window.List extends Spine.Model
  @configure 'List', 'name', 'tasks', 'permanent'

  @extend @Sync
  @include @Sync

  @current: null

  constructor: ->
    super
    @tasks ?= []
    Task.bind "create", @addTask
    Task.bind "destroy", @removeTask
    Task.bind "update:id", @updateTask

  # ----------
  # Task Order
  # ----------

  # Add a task to a list
  addTask: (task) =>
    return unless task.list is @id
    if @tasks.indexOf(task.id) < 0
      @tasks.push(task.id)
      @save
        sync: off # Don't emit event to server

  # Remove a task from a list
  removeTask: (task, options) =>
    return unless options.forceUpdate or task.list is @id
    index = @tasks.indexOf(task.id)
    if index > -1
      @tasks.splice(index, 1)
      @save
        sync: off # Don't emit event to server

  # Change clientID to serverID
  updateTask: (task, val, old) =>
    return unless task.list is @id
    index = @tasks.indexOf(old)
    if index > -1
      @tasks[index] = val
      @save
        sync: off # Don't emit event to server

  # Move a task from one list to another
  moveTask: (task, newList) =>
    task.updateAttribute "list", newList.id
    newList.addTask task
    @removeTask task, forceUpdate: yes

  # Change order (used for sorting tasks)
  setOrder: (tasks) =>
    console.log "Setting order: ", tasks
    @updateAttribute("tasks", tasks)

  # pulls all completed tasks out of list order
  moveCompleted: =>
    order = @tasks.slice(0)

    for task in @tasks
      try
        # Shouldn't fail if the task isn't in the list
        if Task.find(task).completed isnt false
          order.splice(order.indexOf(task), 1)
      catch err
        # We pull the task out of the list anyway
        order.splice(order.indexOf(task), 1)

    # Does it after loop is finished.
    @updateAttribute("tasks", order)


# Is this the best way to do this?
List.bind "refresh", ->
  return unless List.current?
  if List.exists(List.current.id)
    console.log "Updating List.current"
    List.current = List.find(List.current.id)
  else
    console.log "Changing List.current to inbox"
    List.current = List.find("inbox")

module.exports = List
