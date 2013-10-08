Base = require 'base'
Sync = require '../controllers/sync'

class Task extends Base.Model

  defaults:
    name: ''
    date: null
    notes: ''
    completed: false
    priority: 1
    list: null

  @extend Sync.core

class TaskCollection extends Base.Collection

  model: Task

  # Get the active tasks
  # - [list] (string) : The list ID. If specified, will only return tasks in that list.
  active: (list) =>
    @filter (task) ->
      !task.completed and (if list then (task.list is list) else yes)

  # Get the completed tasks
  completed: =>
    @filter (task) -> task.completed

  # Get the matching tasks for a list
  list: (listId) =>
    return [] unless listId
    if listId is 'all' then return @active()
    else if listId is 'completed' then return @completed()
    @filter (task) -> task.list is listId

  # TODO: Move this somewhere else
  default: ->
    if Task.length is 0
      # Circular dependency fix
      List =       require '../models/list'
      List.refresh require '../models/default/list.json'
      @refresh     require '../models/default/task.json'

  #
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

module.exports = new TaskCollection()
