
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
    return @queue

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
      original = obj[id]
      optimized = @optimize original, [event, model, time]
      if optimized
        obj[id] = optimized
      else
        delete obj[id]
      @save()

      return time
    return false

  _mergeUpdate: (a, b) ->

    for own key, value of b[1]
      a[1][key] = value
      if b[2][key]? then a[2][key] = b[2][key]

    return a

  _mergeCreate: (create, update) ->

    # Push updates onto create item
    for key, val of update[1]
      create[1][key] = val

    # Get latest update time
    times = []
    times.push time for key, time of update[2]
    create[2] = Math.max.apply this, times

    return create

  ###
   * Merges events together to make syncing faster
   * create + update = create
   * create + destroy = nothing
   * update + destroy = destroy
   * update + update + update = update
   *
   * - a (array) : original event
   * - b (array) : new event
  ###

  optimize: (a, b) ->

    if a is undefined
      return b

    if a[0] is CREATE and b[0] is UPDATE
      return @_mergeCreate a, b

    if a[0] is CREATE and b[0] is DESTROY
      return null

    if a[0] is UPDATE and b[0] is UPDATE
      return @_mergeUpdate a, b

    if a[0] is UPDATE and b[0] is DESTROY
      return b

    return null

module.exports = new Queue
