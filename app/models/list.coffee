Spine = require('spine')
Task = require('models/task')

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
    Task.bind "updateAttr", @updateTask

  addTask: (task) =>
    return unless task.list is @id
    if @tasks.indexOf(task.id) < 0
      @tasks.push(task.id)
      @save()

  removeTask: (task, force) =>
    return unless force or task.list is @id
    index = @tasks.indexOf(task.id)
    if index > -1
      @tasks.splice(index, 1)
      @save()

  moveTask: (task, newList) =>
    task.updateAttribute "list", newList.id
    newList.addTask task
    @removeTask task, "force"

  # BUG: gets called twice on first run...
  updateTask: (task, attr, val, old) =>
    return unless attr in ["id"]
    index = @tasks.indexOf(old)
    if index > -1
      @tasks[index] = val
      @save()

  setOrder: (tasks) =>
    console.log "Setting order: ", tasks
    @updateAttribute("tasks", tasks)

module.exports = List
