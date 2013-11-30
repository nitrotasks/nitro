Base = require 'base'
List = require '../models/list'
Local = require '../controllers/local'

class Task extends Base.Model

  defaults:
    id: null
    listId: null
    date: null
    name: ''
    notes: ''
    priority: 1
    completed: false

  # Get the actual list
  list: =>
    List.get @listId


class TaskCollection extends Base.Collection

  className: 'task'

  model: Task

  constructor: ->
    super



  # Get the active tasks
  active: =>
    @filter (task) -> !task.completed

  # Get the completed tasks
  completed: =>
    @filter (task) -> task.completed

  # Get the matching tasks for a list
  list: (listId) =>
    return [] unless listId
    @filter (task) -> task.listId is listId

  # Sort the tasks
  sortTasks: (tasks) =>
    sorted = tasks.sort (a, b) ->
      # If logged, move to bottom
      if a.completed is b.completed
        diff = a.priority - b.priority
        if diff is 0
          # If the priorities are the same then sort by date, then by name
          newA = if a.date is false or a.date is '' then Infinity else a.date
          newB = if b.date is false or b.date is '' then Infinity else b.date

          diff = newB - newA

          # Infinity - Infinity is NaN
          if isNaN(diff)
            b.name.localeCompare(a.name)
          else diff
        else diff
      else if a.completed and not b.completed then -1
      else if not a.completed and b.completed then 1
      else a.completed - b.completed

  # Search through tasks
  search: (query) =>
    return @all() unless query.length > 0
    query = query.toLowerCase().split ' '
    @filter (item) ->
      for word in query
        if item.name.toLowerCase().indexOf(word) < 0 then return false
      return true

  # Find tasks with matching tags
  tag: (tag) =>
    return [] unless tag
    tag = tag.toLowerCase()
    @filter (item) ->
      item.name?.toLowerCase().indexOf('#'+tag) > -1

# Create a new TaskCollection to store all tasks
allTasks = new TaskCollection()

# Add task to the list.task collection
allTasks.on 'create:model', (task) =>
  if List.exists task.listId
    list = task.list()
    list.tasks.add task, silent: true
    list.tasks.trigger 'change'

# Add localStorage support
new Local(allTasks)

module.exports = allTasks
