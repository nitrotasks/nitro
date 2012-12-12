Spine  = @Spine or require('spine')
Model  = Spine.Model
SocketIo = require('lib/socket.io')
UpdateAttribute = require('lib/updateAttr')

socket = SocketIo.connect("http://localhost:5000")


# ------------------
# Handle Sync Events
# ------------------

Sync =

  # Sync status
  online: yes
  enabled: yes

  # Store user information
  user: "username"

  # Hold unsynced events
  queue: JSON.parse localStorage.Queue or "[]"

  # Send data to the server using Socket.IO
  emit: (name, args, fn) ->

    # If the user is not online, we should check the arguments
    # and possibly store them in the queue for later
    if not @online
      @addToQueue(name, args)
      return

    return unless @enabled
    socket.emit(name, args, fn)

  # Go through each item in the queue and send it to the server
  sync: ->
    # Don't run if the queue is empty
    return if @queue.length is 0
    # Send queue to server
    @emit 'sync', @queue, (records) ->
      # Update records
      console.log records
      @queue = []
      @saveQueue()
    true

  # Prevents models triggering events when we update them
  disable: (callback) ->
    if @enabled
      @enabled = no
      try
        do callback
      catch e
        throw e
      finally
        @enabled = yes
    else
      do callback

  # Check an event, and if it is a model update add it to the queue
  # TODO: Add optimization for duplicate events with timestamps
  addToQueue: (name, args) ->
    if name in ["create", "update", "destroy"]
      now = Date.now()
      if name is "update"
        time = {}
        for own key of args[1]
          continue if key is "id"
          time[key] = now
      else
        time = now
      @queue.push [name, args, time]
      @optimizeQueue()

  # Merges events together to make syncing faster
  # create + update = create
  # create + destroy = nothing
  # update + destroy = destroy
  # update + update + update = update
  optimizeQueue: ->
    queue = []
    models = {}

    # Sort events into groups by item ID
    for event in @queue
      [type, [className, model], time] = event
      switch type
        when "create", "update" then item = model
        when "destroy" then item = {id: model}

      if not models.hasOwnProperty className
        models[className] = {}

      if not models[className].hasOwnProperty(item.id)
        models[className][item.id] = []

      models[className][item.id].push event

    # Loop through each model e.g. Task and List
    for className, items of models

      # Loop through each item in that model
      for id, events of items

        # Sort events into chronological order
        events.sort (a,b) ->
          time =
            a: 0
            b: 0

          for x, i in [a,b]
            if typeof x[2] is "object"
              times = []
              times.push time for key, time of x[2]
              value = Math.max.apply @, times
            else value = x[2]

            if i is 0
              time.a = value
            else
              time.b = value

          time.a - time.b

        # Hold the last model to have that ID
        section =
          create: no
          update: []
          destroy: no

        # Get the last models events that had that id
        for index in [events.length-1..0]
          # Stop as soon af we have a create event
          break if section.create isnt no
          event = events[index]
          type = event[0]
          switch type
            when "create"
              section.create = event
            when "update"
              section.update.unshift event
            when "destroy"
              section.destroy = event

        # Merge update and destroy events
        if section.destroy and section.update.length
          queue.push section.destroy
          continue

        lastUpdate = {}
        timestamps = {}

        # Merge update events
        for event in section.update
          [type, [cN, model], time] = event
          for own key, value of model
            if value isnt lastUpdate[key]
              lastUpdate[key] = value
              timestamps[key] = time[key] unless key is "id"

        # Merge create and update events
        if section.create and not section.destroy and section.update.length
          # Push updates onto original task
          for key, val of lastUpdate
            section.create[1][1][key] = val
          # Get latest update time
          times = []
          times.push time for key, time of timestamps
          section.create[2] = Math.max.apply @, times
          # Add to queue
          queue.push section.create
          continue

        # Present event as a queue
        if not (section.create and section.destroy)

          # Add create event
          queue.push section.create if section.create

          # Add update event(s)
          if section.update.length
            queue.push ["update", [className, lastUpdate], timestamps]

          # Add destroy events
          queue.push section.destroy if section.destroy

    # Save queue
    @queue = queue
    @saveQueue()
    true

  saveQueue: ->
    # Save queue to localstorage
    localStorage.Queue = JSON.stringify @queue

  goOffline: ->
    console.error "NitroSync: Couldn't connect to server"
    Sync.online = no

# Handle offline modes
for event in ['error', 'disconnect', 'connect_failed']
  socket.on event, Sync.goOffline

# Login to server
socket.emit 'login', Sync.user

# Sync unsunk changes
socket.on 'connect', ->
  Sync.sync()

# Just in case you need any default values
class Base

# Control all records in the model
class Collection extends Base

  constructor: (@model) ->

    # Set up bindings for server events

    socket.on 'create', (data) =>
      [className, item] = data
      if className is @model.className
        Sync.disable =>
          @model.create item

    socket.on 'update', (data) =>
      [className, item] = data
      if className is @model.className
        Sync.disable =>
          @model.find(item.id).updateAttributes(item)

    socket.on 'destroy', (data) =>
      [className, id] = data
      if className is @model.className
        Sync.disable =>
          @model.find(id).destroy()

  # Request a copy of all records on the server
  all: (params, callback) ->
    Sync.emit 'fetch', @model.className, (data) =>
      @recordsResponse data
      callback data

  # Update all records
  fetch: (params = {}, options = {}) ->
    @all params, (records) =>
      @model.refresh(records, options)

  # Private

  # Fired when records data is returned
  recordsResponse: (data) =>
    @model.trigger('syncSuccess', data)


# -----------------------
# Control a single record
# -----------------------

class Singleton extends Base

  constructor: (@record) ->
    @model = @record.constructor

  create: (params, options) ->
    Sync.emit 'create', [@model.className, @record.toJSON()], (id) =>
      Sync.disable =>
        @record.changeID(id)

  update: (model, key, val, old) =>
    return if key is "id" # We don't need to update on ID changes
    item =
      id: @record.id
    item[key] = val
    Sync.emit 'update', [@model.className, item]

  destroy: (params, options) ->
    Sync.emit 'destroy', [@model.className, @record.id]

Include =
  sync: -> new Singleton(this)

Extend =
  sync: -> new Collection(this)


# ------------
# Extend Model
# ------------

Model.Sync =
  extended: ->
    @fetch @syncFetch
    @bind "change", @syncChange
    @bind "updateAttr", @syncUpdate
    @bind "refresh update", @saveLocal

    @extend Extend
    @extend UpdateAttribute
    @include Include

  # Private

  syncFetch: () ->
    @loadLocal()
    @sync().fetch(arguments...)

  syncChange: (record, type, options = {}) ->
    # Update events are handled by syncUpdate
    return if type is "update"
    @saveLocal()
    return if options.sync is false
    record.sync()[type](options.sync, options)

  syncUpdate: (record) ->
    record.sync().update.apply(this, arguments)

  loadLocal: ->
    result = localStorage[@className]
    @refresh(result or [], clear: true)

  saveLocal: ->
    result = JSON.stringify(@)
    localStorage[@className] = result


# ------------
# Sync Methods
# ------------

Model.Sync.Methods =
  extended: ->
    @extend Extend
    @include Include


# -------
# Globals
# -------

Spine.Sync = Sync
module?.exports = Sync
