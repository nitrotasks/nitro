Base           = require 'base'
Jandal         = require 'jandal/build/client'
event          = require '../utils/event'
config         = require '../utils/config'
user           = require '../models/user'
queue          = require '../controllers/queue'
CollectionSync = require '../controllers/sync/collection'
ModelSync      = require '../controllers/sync/model'

Jandal.handle 'sockjs'

# -----------------------------------------------------------------------------
# Sync Controller
# -----------------------------------------------------------------------------

Sync =

  online: no
  disabled: no

  socket: new Jandal()

  connect: () ->
    @connection = new SockJS("http://#{ config.sync }")
    @socket.connect @connection
    @connection.onopen = @open

  open: ->
    Sync.online = yes
    Sync.auth()
    event.trigger 'socket:open'

  auth: ->
    @socket.emit 'user.auth', user.uid, user.token, (err, status) ->
      if err
        return console.log err
      if status
        event.trigger 'socket:auth:success'
      else
        event.trigger 'socket:auth:fail'

  namespace: (name) ->
    namespace = Sync.socket.namespace(name)

    emit = namespace.emit
    namespace.emit = (event, arg1, arg2, arg3) ->
      if Sync.disabled then return
      if Sync.online
        emit.call(namespace, event, arg1, arg2, arg3)
      else
        queue.push name, event, arg1, arg2, arg3

    return namespace

  disable: (fn) ->
    if Sync.disabled then return fn()
    Sync.disabled = yes
    fn()
    Sync.disabled = no

  getUserInfo: ->
    Sync.socket.emit 'user.info', (err, info) ->
      console.log err, info
      user.setAttributes info

  sync: (fn) ->
    Sync.socket.emit 'queue.sync', queue.toJSON(), (err, data) ->
      fn(data)
      queue.clear()

# -----------------------------------------------------------------------------
# Events
# -----------------------------------------------------------------------------

event.on 'auth:token', -> Sync.connect()
event.on 'socket:auth:success', ->
  Sync.getUserInfo()
  Sync.sync (data) ->
    event.trigger 'sync:refresh:task', data.task
    event.trigger 'sync:refresh:list', data.list
    event.trigger 'sync:refresh:pref', data.pref


# -----------------------------------------------------------------------------
# Sync Model Handler
# -----------------------------------------------------------------------------

timestamps = (obj) ->
  time = {}
  now = Date.now()
  for key of obj when key isnt 'id'
    time[key] = now
  return time

###
 * Takes one model and listens to events on it
 *
 * - model (Base.Collection)
 * - model (Base.Model)
###

Sync.include = (model) ->

  event.on 'sync:refresh:' + model.classname, (data) ->
    console.log 'refreshing', model.classname, data
    model.refresh(data, true)

  if model instanceof Base.Collection
    handler = new CollectionSync(model)
  else
    handler = new ModelSync(model)

  namespace = Sync.namespace model.classname

  handler.oncreate = (item, options) ->
    namespace.emit 'create', item.toJSON(), Date.now(), (err, id) =>
      if err or not id then return
      Sync.disable => item.id = id

  handler.onupdate = (model, key, value) ->
    data = id: model.id
    data[key] = value
    namespace.emit 'update', data, timestamps(data)

  handler.ondestroy = (model, options) ->
    namespace.emit 'destroy', {id: model.id}, Date.now()

  namespace.on 'create', (item) -> Sync.disable -> handler.create(item)
  namespace.on 'update', (item) -> Sync.disable -> handler.update(item)
  namespace.on 'destroy', (id) -> Sync.disable -> handler.destroy(id)

  handler.listen()


module.exports = Sync
