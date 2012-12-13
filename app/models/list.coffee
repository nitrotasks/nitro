Spine = require('spine')
Task = require('models/task')

class window.List extends Spine.Model
  @configure 'List', 'name', 'tasks'

  @extend @Sync
  @include @Sync

  @current: null

  constructor: ->
    super
    @tasks ?= []
    Task.bind "create", @addTask
    Task.bind "destroy", @removeTask

  addTask: (task) =>
    return unless task.list is @id
    if @tasks.indexOf(task.id) < 0
      @tasks.push(task.id)
      @save()

  removeTask: (task) =>
    return unless task.list is @id
    index = @tasks.indexOf(task.id)
    if index > -1
      @tasks.splice(index, 1)
      @save()

  setOrder: (tasks) ->
    @task = tasks

module.exports = List
