Base           = require 'base'
Jandal         = require 'jandal/client'
event          = require '../utils/event'
config         = require '../utils/config'
user           = require '../models/user'
queue          = require '../controllers/queue'

Jandal.handle 'websockets'

# -----------------------------------------------------------------------------
# Sync Controller
# -----------------------------------------------------------------------------

Sync =

  online: no
  disabled: no

  socket: new Jandal()

  connect: () ->
    @connection = new SockJS(config.sync)
    @socket.connect @connection
    @socket.on('socket.open', @open)
    @socket.on('socket.error', @error)
    @socket.on('socket.close', @close)

  open: ->
    Sync.online = yes
    Sync.auth()
    event.trigger 'socket:open'

  error: (code) ->
    console.log 'error with socket', arguments

  close: ({ code, reason }) ->
    console.log code, reason

    switch code
      when 1002
        console.log 'Client cannot connect to server'
      when 3002
        console.log 'Could not auth with server'
        event.trigger 'auth:old_token'

    event.trigger 'app:offline'

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

  queue: ->
    Sync.socket.emit 'queue.sync', queue.toJSON(), Date.now(), Sync._queue

  _queue: (err, data) =>

      console.log 'queue.sync', err, data

      queue.clear()

      if err
        console.log err
        return

      event.trigger 'sync:refresh:task', data.task
      event.trigger 'sync:refresh:list', data.list
      event.trigger 'sync:refresh:pref', data.pref

      if not data.task.length and not data.list.length and data.pref.sort is null
        Sync.online = false
        defaultData = require '../controllers/default'
        defaultData.load()
        Sync.online = true
        Sync.queue()


# -----------------------------------------------------------------------------
# Events
# -----------------------------------------------------------------------------

event.on 'auth:token', -> Sync.connect()
event.on 'socket:auth:success', ->
  Sync.getUserInfo()
  Sync.queue()


# -----------------------------------------------------------------------------
# Sync Model Handler
# -----------------------------------------------------------------------------

###
 * Takes one model and listens to events on it
 *
 * - model (Base.Collection)
 * - model (Base.Model)
###

Sync.include = (model, Handler) ->

  event.on 'sync:refresh:' + model.classname, (data) ->
    model.refresh(data, true)

  handler = new Handler(model)
  namespace = Sync.namespace model.classname

  handler.oncreate = (item, options) ->
    namespace.emit 'create', item.toJSON(), (err, id) =>
      if err or not id then return
      Sync.disable => item.id = id

  handler.onupdate = (data) ->
    namespace.emit 'update', data

  handler.ondestroy = (model, options) ->
    namespace.emit 'destroy',  id: model.id

  namespace.on 'create', (item) -> Sync.disable -> handler.create(item)
  namespace.on 'update', (item) -> Sync.disable -> handler.update(item)
  namespace.on 'destroy', (id) -> Sync.disable -> handler.destroy(id)

  handler.listen()

module.exports = Sync
