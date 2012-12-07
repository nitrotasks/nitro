Spine  = @Spine or require('spine')
Model  = Spine.Model
SocketIo = require('lib/socket.io')

socket = SocketIo.connect("http://localhost:5000")

# Handle socket.io
Sync =
  enabled: true

  disable: (callback) ->
    if @enabled
      @enabled = false
      try
        do callback
      catch e
        throw e
      finally
        @enabled = true
    else
      do callback

  emit: (name, args, fn) ->
    return unless @enabled
    socket.emit(name, args, fn)

# Just in case you need any default values
class Base

# Control all records in the model
class Collection extends Base

  constructor: (@model) ->

    # Set up bindings for server events

    socket.on 'create', (data) =>
      [model, item] = data
      if model is @model.className
        Sync.disable =>
          @model.create item

    socket.on 'update', (data) =>
      [model, item] = data
      if model is @model.className
        Sync.disable =>
          @model.find(item.id).updateAttributes(item)

    socket.on 'destroy', (data) =>
      [model, id] = data
      if model is @model.className
        Sync.disable =>
          @model.find(id).destroy()

  # Request a copy of all records on the server
  all: (params, callback) ->
    Sync.emit 'fetch', ["username", @model.className], (data) =>
      console.log "Data: ", data
      @recordsResponse data
      callback data

  # Update all records
  fetch: (params = {}, options = {}) ->
    console.log "fetching data"
    @all params, (records) =>
      @model.refresh(records, options)


  # -- PRIVATE --

  # Fired when records data is returned
  recordsResponse: (data) =>
    @model.trigger('syncSuccess', data)


# Control a single record
class Singleton extends Base

  constructor: (@record) ->
    @model = @record.constructor

  create: (params, options) ->
    console.log "create", @record
    Sync.emit 'create', [@model.className, @record]

  update: (params, options) ->
    console.log "update", @record
    Sync.emit 'update', [@model.className, @record]

  destroy: (params, options) ->
    console.log "destroy", @record
    Sync.emit 'destroy', [@model.className, @record.id]

Include =
  sync: -> new Singleton(this)

Extend =
  sync: -> new Collection(this)

Model.Sync =
  extended: ->
    @fetch @syncFetch
    @change @syncChange

    @extend Extend
    @include Include

  # Private

  syncFetch: ->
    # @loadLocal()
    @sync().fetch(arguments...)

  syncChange: (record, type, options = {}) ->
    # @saveLocal()
    return if options.sync is false
    record.sync()[type](options.sync, options)

  saveLocal: ->
    result = JSON.stringify(@)
    localStorage[@className] = result

  loadLocal: ->
    result = localStorage[@className]
    @refresh(result or [], clear: true)

Model.Sync.Methods =
  extended: ->
    @extend Extend
    @include Include

# Globals
module?.exports = Sync
