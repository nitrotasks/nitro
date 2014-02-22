Base           = require 'base'
Jandal         = require 'jandal/client'
event          = require '../utils/event'
config         = require '../utils/config'
Time           = require '../utils/time'
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

  connect: (@socketToken) ->
    @connection = new SockJS(config.sync)
    @socket.once('socket.open', @open)
    @socket.once('socket.error', @error)
    @socket.once('socket.close', @close)
    @socket.connect(@connection)

  open: ->
    Sync.online = yes
    Sync.auth()
    event.trigger 'socket:open'

  error: (code) ->
    console.log 'error with socket', arguments

  close: (code, reason) ->

    switch code
      when 1002
        console.log 'Client cannot connect to server'
      when 3002
        console.log 'Could not auth with server'
        event.trigger 'auth:old_token'

    event.trigger 'app:offline'

  auth: (socketToken) ->

    @socket.emit 'user.auth', @socketToken, (err, status) ->

      if err
        event.trigger 'socket:auth:fail'
        return console.log err
      event.trigger 'socket:auth:success'

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
      console.log 'getUserInfo', err, info
      user.setAttributes info

  loadDefaultData: ->
    defaultData = require '../controllers/default'
    defaultData.load()

  queue: ->
    Sync.socket.emit 'queue.sync', queue.toJSON(), Time.now(), Sync._queue

  _queue: (err, data) ->

    console.log 'queue.sync', err, data

    queue.clear()

    if err
      console.log err
      return

    event.trigger 'sync:refresh:task', data.task
    event.trigger 'sync:refresh:list', data.list
    event.trigger 'sync:refresh:pref', data.pref

    if not data.task.length and
    not data.list.length and
    data.pref.sort is null
      Sync.online = false
      Sync.loadDefaultData()
      Sync.online = true
      Sync.queue()


# -----------------------------------------------------------------------------
# Events
# -----------------------------------------------------------------------------

event.on 'auth:socket:token', (token) ->
  console.log 'got auth:socket:token', token
  Sync.connect(token)

event.on 'socket:auth:success', ->
  Sync.getUserInfo()
  Sync.queue()

event.on 'auth:skip', ->
  console.log 'Skipping auth'
  Sync.loadDefaultData()


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

  handler.oncreate = (model, data) ->
    namespace.emit 'create', data, (err, id) ->
      if err or not id then return
      Sync.disable -> model.id = id

  handler.onupdate = (model, data) ->
    namespace.emit 'update', model.id, data

  handler.ondestroy = (model) ->
    namespace.emit 'destroy',  id: model.id

  namespace.on 'create', (item) -> Sync.disable -> handler.create(item)
  namespace.on 'update', (item) -> Sync.disable -> handler.update(item)
  namespace.on 'destroy', (id) -> Sync.disable -> handler.destroy(id)

  handler.listen()

module.exports = Sync
