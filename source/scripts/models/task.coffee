Base       = require 'base'
List       = require '../models/list'
Local      = require '../controllers/local'
Sync       = require '../controllers/sync'
Handler    = require '../controllers/sync/task'
prettyDate = require '../utils/prettydate'

class Task extends Base.Model

  defaults:
    id: null
    listId: null
    date: 0
    name: ''
    notes: ''
    priority: 1
    completed: 0

  # Get the actual list
  list: =>
    List.get @listId

  prettyDate: =>
    date = if @date then new Date(@date) else null
    prettyDate(date)


###*
 * Basic collection of tasks for each list
###

class TaskCollection extends Base.Collection

  model: Task

  constructor: ->
    super

    # Cache the sorted tasks
    @sortCache = null

    # Destroy cache if contents change
    @on 'create:model change:model', =>
      @sortCache = null

    @on 'before:destroy:model', (task) =>
      return unless @sortCache
      index = @sortCache.indexOf task
      @sortCache.splice index, 1

  # Sort the tasks, and cache the result
  sort: =>
    if @sortCache then return @sortCache
    @sortCache = allTasks.sort @slice()

###*
 * Holds every task ever made
###

class TaskSingleton extends Base.Collection

  Collection: TaskCollection

  classname: 'task'

  model: Task

  # Get the active tasks
  active: =>
    @filter (task) -> not task.completed

  # Get the completed tasks
  completed: =>
    @filter (task) -> task.completed

  # Get the matching tasks for a list
  list: (listId) =>
    return [] unless listId
    @filter (task) -> task.listId is listId

  # Search through tasks
  # - type (string) : can be 'all', 'active' or 'completed'
  search: (query, type='all') =>

    if query.length is 0
      if type is 'active' then return @active()
      if type is 'completed' then return @completed()
      return @all()

    tasks = @all()

    return tasks unless query.length > 0
    query = query.toLowerCase().split(' ')

    tasks.filter (item) ->

      if type is 'active'
        return false if item.completed

      if type is 'completed'
        return false unless item.completed

      for word in query
        if item.name.toLowerCase().indexOf(word) < 0
          return false

      return true


  ###
   * Sort
   *
   * Sorts an task collection in a specific order:
   *   1. Completed tasks are at the bottom of everything
   *   2. Highest priority at the top, lowest at the bottom
   *   3. Closest due date at the top, no due date at the bottom
   *   4. Alphabetically sort the name, A: top, Z: bottom
   *
   * - tasks (collection) : tasks to sort
   * > sorted array
  ###

  sort: (tasks) =>
    return unless tasks
    tasks.sort (a, b) ->

      # If logged, move to bottom
      if a.completed is b.completed

        diff = b.priority - a.priority
        if diff is 0

          diff = (a.date or Infinity) - (b.date or Infinity)

          # Infinity - Infinity is NaN
          if isNaN(diff)
            a.name.localeCompare(b.name)
          else diff

        else diff

      else if a.completed and not b.completed then 1
      else if not a.completed and b.completed then -1
      else b.completed - a.completed

  # Find tasks with matching tags
  tag: (tag) =>
    return [] unless tag
    tag = tag.toLowerCase()
    regex = new RegExp("##{ tag }\\b", 'i')
    @filter (item) -> item.name?.match(regex)

# Create a new TaskCollection to store all tasks
allTasks = new TaskSingleton()

# Add task to the list.task collection
allTasks.on 'create:model', (task) =>
  if List.exists(task.listId)
    list = task.list()
    list.tasks.add task

# Add localStorage support
Local.include(allTasks)

# Add sync support
Sync.include(allTasks, Handler)

module.exports = allTasks
