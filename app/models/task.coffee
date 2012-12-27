Spine = require('spine')

class window.Task extends Spine.Model

  # Set model properties
  @configure 'Task',
    'name',
    'date',
    'notes',
    'completed',
    'priority',
    'list'

  @extend @Sync
  @include @Sync

  @active: (list) =>
    @select (task) ->
      !task.completed and (if list then (task.list is list) else yes)

  @completed: =>
    @select (task) ->
      task.completed

  @list: (listId) =>
    return [] unless listId
    if listId is "all" then return @active()
    else if listId is "completed" then return @completed()
    @all().filter (task) ->
        task.list is listId

  @sort: (tasks) =>
    sorted = tasks.sort (a, b) ->
      # If logged, move to bottom
      if a.completed is b.completed
        diff = a.priority - b.priority
        if diff is 0
          # If the priorities are the same then sort by name
          b.name.localeCompare(a.name)
        else diff
      else if a.completed and not b.completed then -1
      else if not a.completed and b.completed then 1

  @filter: (query) ->
    return all() unless query
    query = query.toLowerCase().split(" ")
    tasks = @all()
    tasks.filter (item) ->
      matches = yes
      for word in query
        regex = new RegExp(word, "i")
        if not item.name?.match(regex) then matches = no
      return matches

  @tag: (tag) ->
    return [] unless tag
    tag = tag.toLowerCase()
    @select (item) ->
      item.name?.toLowerCase().indexOf('#'+tag) > -1

module.exports = Task
