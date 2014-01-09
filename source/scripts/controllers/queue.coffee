
CLASSNAME = 'queue'

CREATE = 'create'
UPDATE = 'update'
DESTROY = 'destroy'

class Queue

  constructor: ->
    @queue = {}
    @load()

  toJSON: =>
    return @queue

  load: =>
    json = localStorage[CLASSNAME]
    try
      @queue = JSON.parse localStorage[CLASSNAME]
    catch e
      delete localStorage.queue

  save: =>
    localStorage[CLASSNAME] = JSON.stringify @queue

  clear: ->
    @queue = {}
    @save()

  push: (classname, event, model) =>
    if event in [CREATE, UPDATE, DESTROY]
      now = Date.now()
      if event is UPDATE
        time = {}
        time[key] = now for own key of model when key isnt 'id'
      else
        time = now
      @queue.push [classname, event, model, time]
      @optimize()
      @save()
      return time
    return false

  _groupItems: =>

    models = {}

    # Sort into groups by classname and item.id
    for item in @queue
      [classname, event, model, time] = item

      switch event
        when 'create', 'update' then id = model.id
        when 'destroy' then id = model

      models[classname] ?= {}
      models[classname][id] ?= []
      models[classname][id].push item

    return models

  # Sort events into chronological order
  _sortItems: (items)  ->

    items.sort (a,b) ->
      time =
        a: 0
        b: 0

      for item, i in [a,b]
        model = item[2]

        if typeof model is 'object'
          times = []
          times.push time for key, time of model
          value = Math.max.apply this, times
        else
          value = model

        if i is 0
          time.a = value
        else
          time.b = value

      time.a - time.b

    return items

  _splitItems: (items) ->

    # Hold the last model to have that ID
    section =
      create: null
      update: []
      destroy: null

    # Get the last models events that had that id
    for index in [items.length - 1 .. 0]

      # Stop as soon af we have a create event
      break if section.create

      item = items[index]
      type = item[1]

      switch type
        when 'create'
          section.create = item
        when 'update'
          section.update.unshift item
        when 'destroy'
          section.destroy = item

    return section

  _mergeUpdate: (updates) ->

    return [null,null] unless updates.length

    lastUpdate = {}
    timestamps = {}

    # Merge update items
    for item in updates

      model = item[2]
      time  = item[3]

      for own key, value of model
        if value isnt lastUpdate[key]
          lastUpdate[key] = value
          timestamps[key] = time[key] unless key is 'id'

    return [lastUpdate, timestamps]

  _mergeCreate: (create, update, timestamps) ->

    # Push updates onto original task
    for key, val of update
      create[2][key] = val

    # Get latest update time
    times = []
    times.push time for key, time of timestamps
    create[3] = Math.max.apply this, times

    return create

  _extractEvent: (event, classname, timestamps) ->

    if not (event.create and event.destroy)

      if event.create
        return event.create

      if event.update
        return [classname, 'update', event.update, timestamps]

      if event.destroy
        return event.destroy


  # Merges events together to make syncing faster
  # create + update = create
  # create + destroy = nothing
  # update + destroy = destroy
  # update + update + update = update
  optimize: ->
    queue = []

    models = @_groupItems()

    for classname, ids of models

      # Loop through each item in that class
      for id, items of ids

        @_sortItems(items)
        event = @_splitItems(items)

        # Merge update and destroy items
        if event.destroy and event.update.length and not event.create
          queue.push event.destroy
          continue

        [event.update, timestamps] = @_mergeUpdate(event.update)

        # Merge create and update items
        if event.create and not event.destroy and event.update
          queue.push @_mergeCreate event.create, event.update, timestamps
          continue

        # Present event as a queue
        event = @_extractEvent(event, classname, timestamps)
        queue.push event if event

    # Save queue
    @queue = queue
    @save()

module.exports = new Queue
