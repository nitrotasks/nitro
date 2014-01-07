Base           = require 'base'
Jandal         = require 'jandal/build/client'
SockJS         = require 'sockjs'
event          = require '../utils/event'
config         = require '../utils/config'
queue          = require '../utils/queue'
User           = require '../models/user'
CollectionSync = require './sync/collection'
ModelSync      = require './sync/model'

Jandal.handle 'sockjs'

# -----------------------------------------------------------------------------
# Sync Controller
# -----------------------------------------------------------------------------

Sync =

  online: yes
  enabled: yes

  connect: (fn) ->
    @connection = new SockJS("http://#{ config.sync }")
    @socket = new Jandal(@connection)
    @connection.onopen = @open

  open: ->
    @online = yes
    event.trigger 'sync:open'
    console.log 'is online'

  namespace: (name) ->

    console.log 'getting namespace', name
    namespace = null

    ns = ->
      if namespace then return namespace
      return namespace = Sync.socket.namespace(name)

    return {}=

      on: (event, fn) ->
        ns().on(event,fn)

      emit: (event, arg1, arg2, arg3) ->
        if @enabled and @online and @socket
          ns().emit(event, arg1, arg2, arg3)
        else
          queue.push [name, event, arg1, arg2, arg3]

  disable: (fn) ->
    if @enabled
      @enabled = no
      fn()
      @enabled = yes
    else
      fn()

  sync: (fn) ->
    @emit 'sync', queue.toJSON(), (data) =>
      fn(data)
      queue.clear()

# -----------------------------------------------------------------------------
# Sync Model Handler
# -----------------------------------------------------------------------------

###
 * Takes one model and listens to events on it
 *
 * - model (Base.Collection)
 * - model (Base.Model)
###

Sync.include = (model) ->

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

  event.once 'sync:open', ->
    namespace.on 'create', handler.create
    namespace.on 'update', handler.update
    namespace.on 'destroy', handler.destroy

  handler.listen()

module.exports = Sync
