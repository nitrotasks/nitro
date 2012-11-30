Spine = require('spine')

class window.Task extends Spine.Model
  @configure 'Task', 'name', 'completed', 'priority', 'list'
  @extend @Local

  @active: (list) =>
    @select (task) ->
      !task.completed and (if list then (task.list is list) else yes)

  @completed: (list) =>
    @select (task) ->
      task.completed and (task.list is list if list)

  @list: (list) =>
    return [] unless list
    if list is "all" then return @byPriority()
    @byPriority().filter (task) ->
        task.list is list

  @byPriority: ->
    @all().sort (a, b) ->
      diff = a.priority - b.priority
      if diff is 0
        # If the priorities are the same
        # then sort by name
        b.name.localeCompare(a.name)
      else diff


module.exports = Task
