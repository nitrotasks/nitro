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

  @extend @Local

  @active: (list) =>
    @select (task) ->
      !task.completed and (if list then (task.list is list) else yes)

  @completed: (list) =>
    @select (task) ->
      task.completed and (task.list is list if list)

  @list: (listId) =>
    return [] unless listId
    if listId is "all" then return @byPriority()
    @byPriority().filter (task) ->
        task.list is listId

  @byPriority: ->
    @all().sort (a, b) ->
      diff = a.priority - b.priority
      if diff is 0
        # If the priorities are the same
        # then sort by name
        b.name.localeCompare(a.name)
      else diff

  @filter: (query) ->
    return all() unless query
    query = query.toLowerCase()
    @select (item) ->
      item.name?.toLowerCase().indexOf(query) > -1

  @tag: (tag) ->
    return [] unless tag
    tag = tag.toLowerCase()
    @select (item) ->
      item.name?.toLowerCase().indexOf('#'+tag) > -1

module.exports = Task
