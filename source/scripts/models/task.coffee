Base = require 'base'
List = require '../models/list'
Local = require '../controllers/local'

class Task extends Base.Model

  defaults:
    id: null
    list: null
    date: null
    name: ''
    notes: ''
    priority: 1
    completed: false

class TaskCollection extends Base.Collection

  className: 'task'

  model: Task

  constructor: ->
    super

    # Add task to the list.task collection
    @on 'create:model', (task) =>
      if List.exists task.list
        list = List.get task.list
        list.tasks.add task, silent: true
        list.tasks.trigger 'change'


  # Get the active tasks
  active: =>
    @filter (task) -> !task.completed

  # Get the completed tasks
  completed: =>
    @filter (task) -> task.completed

  # Get the matching tasks for a list
  list: (listId) =>
    return [] unless listId
    if listId is 'all' then return @active()
    else if listId is 'completed' then return @completed()
    @filter (task) -> task.list is listId

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
    return @all unless query
    query = query.toLowerCase().split(' ')
    @filter (item) ->
      matches = yes
      for word in query
        if not item.name?.toLowerCase().match(word) then matches = no
      return matches

  # TODO: This should be put in a seperate file

  # Find tasks with matching tags
  tag: (tag) =>
    return [] unless tag
    tag = tag.toLowerCase()
    @filter (item) ->
      item.name?.toLowerCase().indexOf('#'+tag) > -1

# Create a new TaskCollection to store all tasks
allTasks = new TaskCollection()

# Add localStorage support
new Local(allTasks)

module.exports = allTasks
