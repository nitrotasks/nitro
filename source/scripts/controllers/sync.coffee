Base     = require 'base'
SocketIo = require '../vendor/socket.io.js'
Event    = require '../utils/event'
config   = require '../utils/config'

# TODO: Where should we put this?
# Event.on 'auth:token', Sync.connnect

# ------------------
# Handle Sync Events
# ------------------

Sync =

  # Hold registered models
  models: {}

  # Sync status
  online: no
  enabled: yes

  # Hold unsynced events
  queue: JSON.parse localStorage.Queue or '[]'

  connect: (uid, token, fn) ->
    @socket = SocketIo.connect("http://#{ config.sync }/?token=#{  token  }&uid=#{ uid }")

    # Handle offline modes
    for event in ['error', 'disconnect', 'connect_failed']
      Event.trigger 'sync:disconnected'
      @socket.on event, Sync.goOffline

    @socket.on 'connect', =>
      @online = yes
      @bindEvents()
      @sync()
      Event.trigger 'sync:connected'
      if fn then fn()

  bindQueue: []

  on: (event, fn) ->
    if not @online
      @bindQueue.push [event, fn]
    else
      @socket.on event, fn

  bindEvents: ->
    for item in @bindQueue
      @socket.on item[0], item[1]
    bindQueue = []

  # Send data to the server using Socket.IO
  emit: (name, args, fn) ->

    # If the user is not online, we should check the arguments
    # and possibly store them in the queue for later
    if not @online
      @addToQueue(name, args)
      return

    return unless @enabled
    @socket.emit(name, args, fn)

  # Go through each item in the queue and send it to the server
  sync: ->
    # return no unless @queue.length
    console.log 'Going to run sync'
    console.log 'Queue:', @queue
    # Send queue to server
    @emit 'sync', @queue, ([tasks, lists]) =>
      # Update records
      console.log 'Lists:', lists
      @models.List.refresh(lists, clear: true)
      console.log 'Tasks:', tasks
      @models.Task.refresh(tasks, clear: true)
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

  # Fetch the user info from the server
  updateInfo: ->
    @emit 'info', null, (info) ->
      Setting.set('user_name', info.name)
      Setting.set('user_email', info.email)
      Setting.set('pro', info.pro)

  # Check an event, and if it is a model update add it to the queue
  # TODO: Add optimization for duplicate events with timestamps
  addToQueue: (name, args) ->
    if name in ['create', 'update', 'destroy']
      now = Date.now()
      if name is 'update'
        time = {}
        for own key of args[1]
          continue if key is 'id'
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
        when 'create', 'update' then item = model
        when 'destroy' then item = {id: model}

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
            if typeof x[2] is 'object'
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
            when 'create'
              section.create = event
            when 'update'
              section.update.unshift event
            when 'destroy'
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
              timestamps[key] = time[key] unless key is 'id'

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
            queue.push ['update', [className, lastUpdate], timestamps]

          # Add destroy events
          queue.push section.destroy if section.destroy

    # Save queue
    @queue = queue
    @saveQueue()
    true

  saveQueue: ->
    # Save queue to localstorage
    localStorage.Queue = JSON.stringify @queue

  exportData: (keys=['tasks', 'lists']) ->
    # Export local data to JSON
    output = {}
    for className, model of @models
      output[className] = model.toJSON()
    JSON.stringify(output)

  importData: (obj) ->
    input = JSON.parse(obj)
    for className, model of @models
      model.refresh(input[className])

  goOffline: ->
    console.error 'NitroSync: Couldn\'t connect to server'
    Setting.trigger('offline')
    Sync.online = no

# Control all records in the model
class Collection

  constructor: (@model) ->

    # Register with sync
    Sync.models[@model.className] = @model

    # Set up bindings for server events

    Sync.on 'create', (data) =>
      console.log '(Sync) create ->', data
      [className, item] = data
      if className is @model.className
        Sync.disable =>
          @model.create item

    Sync.on 'update', (data) =>
      console.log '(Sync) update ->', data
      [className, item] = data
      if className is @model.className
        Sync.disable =>
          @model.find(item.id).updateAttributes(item)

    Sync.on 'destroy', (data) =>
      console.log '(Sync) delete ->', data
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

class Singleton

  constructor: (@record) ->
    @model = @record.constructor

  create: (params, options) ->
    Sync.emit 'create', [@model.className, @record.toJSON()], (id) =>
      Sync.disable =>
        @record.changeID(id)

  update: (model, key, val, old, options) =>
    return if key is 'id' # We don't need to update on ID changes
    item =
      id: @record.id
    item[key] = val
    console.log '(Sync)', item
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

class Sync.Collection extends Base.Collection

  constructor: ->
    super
    # @bind 'change', @syncChange
    # @bind 'updateAttr', @syncUpdate
    @on 'fetch', @fetch
    @on 'save:model create:model change:model remove:model', @save

  syncFetch: =>
    @loadLocal()
    # @sync()#.fetch(arguments...)

  syncChange: (record, type, options = {}) ->
    # Update events are handled by syncUpdate
    return if type is 'update'
    @saveLocal()
    return if options.sync is off
    record.sync()[type](options.sync, options)

  syncUpdate: (record, key, value, old, options) ->
    return if options.sync is off
    record.sync().update.apply(this, arguments)

  fetch: =>
    result = JSON.parse localStorage[@className] or '[]'
    @refresh result, true

  save: =>
    console.log '[' + @className + ']', 'saving', arguments
    localStorage[@className] = JSON.stringify @toJSON()

module.exports = Sync