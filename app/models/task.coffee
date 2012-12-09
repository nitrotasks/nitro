Spine = require('spine')

class Task extends Spine.Model

  isArray = (value) ->
    Object::toString.call(value) is '[object Array]'

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

  @refresh: (values, options = {}) ->
    if options.clear
      @records  = {}
      @crecords = {}

    records = @fromJSON(values)
    records = [records] unless isArray(records)
    # records = @sort(records)

    for record in records
      record.id           or= record.cid
      @records[record.id]   = record
      @crecords[record.cid] = record

    @trigger('refresh', @cloneArray(records))
    this

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

  @sort: (tasks) ->
    tasks.sort (a, b) ->
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
    results = []
    @select (item) ->
      matches = yes
      for word in query
        regex = new RegExp(word, "i")
        if not item.name?.match(regex) then matches = no
      results.push(item) unless matches is no
    return results

  @tag: (tag) ->
    return [] unless tag
    tag = tag.toLowerCase()
    @select (item) ->
      item.name?.toLowerCase().indexOf('#'+tag) > -1

module.exports = Task
