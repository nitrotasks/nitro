Base           = require 'base'
Jandal         = require 'jandal'
SockJS         = require 'sockjs'
event          = require '../utils/event'
config         = require '../utils/config'
queue          = require '../utils/queue'
User           = require '../models/user'
CollectionSync = require './sync/collection'
ModelSync      = require './sync/model'

Jandal.handle 'socksjs'

# -----------------------------------------------------------------------------
# Sync Controller
# -----------------------------------------------------------------------------

Sync =

  online: yes
  enabled: yes
  queue: queue

  connect: (fn) ->
    @connection = new SockJS("http://#{ config.sync }")
    @socket = new Jandal(@connection)
    @connection.onopen = @open

  open: ->
    @online = yes
    console.log 'is online'

  on: (event, fn) ->
    if @online
      @socket.on(event, fn)
    else
      @queue.push [event, fn]

  emit: (event, arg1, arg2, arg3) ->
    return unless @enabled
    @socket.emit(event, arg1, arg2, arg3)

  disable: (fn) ->
    if @enabled
      @enabled = no
      fn()
      @enabled = yes
    else
      fn()


# -----------------------------------------------------------------------------
# Sync Model Handler
# -----------------------------------------------------------------------------

###
 * Takes one model and listens to events on it
 *
 * - model (Base.Collection)
 * - model (Base.Model)
###

AttachSync = (model) ->

  if model instanceof Base.Collection
    handler = new CollectionSync(model)
  else
    handler = new ModelSync(model)

  namespace = Sync.namespace model.classname

  handler.oncreate = (model, options) ->
    namespace.emit 'create', model.toJSON(), (id) =>
      Sync.disable => model.id = id

  handler.onupdate = (model, key, value) ->
    data = id: model.id
    data[key] = value
    namespace.emit 'update', data

  handler.ondestroy = (model, options) ->
    namespace.emit 'destroy', model.id

  namespace.on 'create', handler.create
  namespace.on 'update', handler.update
  namespace.on 'destroy', handler.destroy

  handler.listen()

module.exports = AttachSync
