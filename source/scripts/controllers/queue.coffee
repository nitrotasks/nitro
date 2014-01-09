
CLASSNAME = 'queue'

CREATE = 0
UPDATE = 1
DESTROY = 2

class Queue

  constructor: ->
    @queue = {}
    @load()

  # Convert queue into old style array
  toJSON: =>
    json = []
    for classname, ids of @queue
      for id, items of ids
        for item in items
          model = item[1]
          if typeof model is 'object'
            obj = { id: id }
            obj[key] = value for key, value of model
          else
            obj = model
          json.push [classname, item[0], obj, item[2]]
    return json

  # Load data from localStorage
  load: =>
    json = localStorage[CLASSNAME]
    try
      @queue = JSON.parse localStorage[CLASSNAME]
    catch e
      delete localStorage.queue

  # Save data to localStorage
  save: =>
    localStorage[CLASSNAME] = JSON.stringify @queue

  clear: ->
    @queue = {}
    @save()

  push: (classname, event, model) =>
    if event is 'create' then event = CREATE
    if event is 'update' then event = UPDATE
    if event is 'destroy' then event = DESTROY

    if event in [CREATE, UPDATE, DESTROY]
      now = Date.now()

      switch event
        when CREATE
          id = model.id
          delete model.id
          time = now
        when UPDATE
          id = model.id
          delete model.id
          time = {}
          time[key] = now for own key of model when key isnt 'id'
        when DESTROY
          id = model
          time = now

      obj = @queue[classname] ?= {}
      arr = obj[id] ?= []
      arr.push [event, model, time]

      @optimize()
      @save()

      return time
    return false


  # Sort events into chronological order
  _sortItems: (a, b)  ->

    time =
      a: 0
      b: 0

    for item, i in [a, b]
      model = item[1]

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
      type = item[0]

      switch type
        when CREATE
          section.create = item
        when UPDATE
          section.update.unshift item
        when DESTROY
          section.destroy = item

    return section

  _mergeUpdate: (updates) ->

    return [null,null] unless updates.length

    lastUpdate = {}
    timestamps = {}

    # Merge update items
    for item in updates

      model = item[1]
      time  = item[2]

      for own key, value of model
        if value isnt lastUpdate[key]
          lastUpdate[key] = value
          timestamps[key] = time[key] unless key is 'id'

    return [lastUpdate, timestamps]

  _mergeCreate: (create, update, timestamps) ->

    # Push updates onto original task
    for key, val of update
      create[1][key] = val

    # Get latest update time
    times = []
    times.push time for key, time of timestamps
    create[2] = Math.max.apply this, times

    return create

  _extractEvent: (event, timestamps) ->

    if not (event.create and event.destroy)

      if event.create
        return event.create

      if event.update
        return [UPDATE, event.update, timestamps]

      if event.destroy
        return event.destroy


  _addToQueue: ([event, model, time], id, classname, queue=@queue) ->
    obj = queue[classname] ?= {}
    arr = obj[id] ?= []
    arr.push [event, model, time]
    return queue


  # Merges events together to make syncing faster
  # create + update = create
  # create + destroy = nothing
  # update + destroy = destroy
  # update + update + update = update
  optimize: ->
    queue = {}
    models = @queue

    # console.log '\n\n', JSON.stringify(@queue, null, 2), '\n\n'

    # Loop through each class
    for classname, ids of models

      # Loop through each id in that class
      for id, items of ids

        items.sort @_sortItems
        event = @_splitItems(items)

        # Merge update and destroy items
        if event.destroy and event.update.length and not event.create
          @_addToQueue event.destroy, id, classname, queue
          continue

        [event.update, timestamps] = @_mergeUpdate(event.update)

        # Merge create and update items
        if event.create and not event.destroy and event.update
          event = @_mergeCreate event.create, event.update, timestamps
          @_addToQueue event, id, classname, queue
          continue

        # Present event as a queue
        event = @_extractEvent(event, timestamps)
        if event
          @_addToQueue event, id, classname, queue

    # Save queue
    @queue = queue
    @save()

module.exports = new Queue
