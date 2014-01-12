Base   = require 'base'
Jandal = require 'jandal'
SockJS = require '../vendor/sockjs'
event  = require '../utils/event'
config = require '../utils/config'
User   = require '../models/user'

Jandal.handle 'sockjs'

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
    @connection = new SockJS "http://#{ config.sync }"
    @socket = new Jandal(@connection)

    @connection.onclose = (code, reason) =>
      console.log 'socket closed', code, reason
      event.trigger 'sync:disconnected'
      @goOffline()

    @connection.onopen = =>
      @online = yes
      @bindEvents()
      @sync()
      event.trigger 'sync:connected'
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
      callback()
      @enabled = yes
    else
      callback()

  # Fetch the user info from the server
  updateInfo: ->
    @emit 'info', null, (info) ->
      User.name = info.name
      User.email = info.email
      User.pro = info.pro

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

  saveQueue: ->
    # Save queue to localstorage
    localStorage.Queue = JSON.stringify @queue

  exportData: (keys=['tasks', 'lists']) ->
    # Export local data to JSON
    output = {}
    for classname, model of @models
      output[classname] = model.toJSON()
    JSON.stringify(output)

  importData: (obj) ->
    input = JSON.parse(obj)
    for classname, model of @models
      model.refresh(input[classname])

  goOffline: ->
    console.error 'NitroSync: Couldn\'t connect to server'
    Setting.trigger('offline')
    Sync.online = no


# Control all records in the model
class Collection

  constructor: (@model) ->

    classname = @model.classname

    # Register with sync
    Sync.models[classname] = @model

    # Set up bindings for server events

    Sync.on 'create', (data) =>

    Sync.on 'update', (data) =>

    Sync.on 'destroy', (data) =>
      console.log '(Sync) delete ->', data
      [classname, id] = data
      if classname is @model.classname
        Sync.disable =>
          @model.find(id).destroy()

  # Request a copy of all records on the server
  all: (params, callback) ->
    Sync.emit 'fetch', @model.classname, (data) =>
      @recordsResponse data
      callback data

  # Update all records
  fetch: (params = {}, options = {}) ->
    @all params, (records) =>
      @model.refresh(records, options)

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
    Sync.emit 'create', [@model.classname, @record.toJSON()], (id) =>
      Sync.disable =>
        @record.changeID(id)

  update: (model, key, val, old, options) =>
    return if key is 'id' # We don't need to update on ID changes
    item =
      id: @record.id
    item[key] = val
    console.log '(Sync)', item
    Sync.emit 'update', [@model.classname, item]

  destroy: (params, options) ->
    Sync.emit 'destroy', [@model.classname, @record.id]



# -----------------------------------------------------------------------------
# Attach to model instance
# -----------------------------------------------------------------------------

class Sync

  constructor: (@model) ->
    # @bind 'change', @syncChange
    # @bind 'updateAttr', @syncUpdate
    @model.on 'fetch', @fetch
    @model.on 'save:model create:model change:model remove:model', @save
    @socket = Sync.socket.namespace @model.classname

    @socket.on 'create', @sync_create
    @socket.on 'update', @sync_update
    @socket.on 'destroy', @sync_destroy

  fetch: =>
    console.log 'fetching', arguments
    # @sync()#.fetch(arguments...)

  change: (record, type, options = {}) ->
    # Update events are handled by syncUpdate
    return if type is 'update'
    return if options.sync is off
    record.sync()[type](options.sync, options)

  update: (record, key, value, old, options) ->
    return if options.sync is off
    record.sync().update.apply(this, arguments)

  sync_create: (item) =>
    console.log '(Sync) create ->', item
    Sync.disable => @model.create item

  sync_update: (item) =>
    console.log '(Sync) update ->', data
    Sync.disable => @model.find(item.id).setAttributes(item)

  sync_destroy: ->

module.exports = Sync
