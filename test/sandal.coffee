Jandal = require('jandal')
{EventEmitter} = require 'events'

setup = ->

  Jandal.handle

    write: (socket, message) ->
      socket.emit('write', message)

    read: (socket, fn) ->
      socket.on('read', fn)

    close: (socket, fn) ->
      socket.on('close', fn)

    error: (socket, fn) ->
      socket.on('error', fn)

    open: (socket, fn) ->
      process.nextTick(fn)


class Socket extends EventEmitter

  ###
   * EVENTS:
   *
   * - read : a message is being sent to the socket
   * - write : a message is being sent from the socket
   * - close : the socket is being closed
   *
  ###

  constructor: ->
    super
    @open = true

  pipe: (socket) =>

    @on 'close', (status, message) ->
      socket.close(status, message)

    @on 'write', (message) ->
      # console.log socket.name, message
      socket.emit('read', message)

    return socket


  end: =>
    @close()

  close: (status, message) =>
    return unless @open
    @open = false
    @emit('close', status, message)



class Sandal extends Jandal

  @setup: setup

  constructor: ->
    super

    id = Math.floor(Math.random() * 1000)

    @serverSocket = new Socket()
    @serverSocket.name = 'server_' + id
    @clientSocket = new Socket()
    @clientSocket.name = 'client_' + id

    @serverSocket.pipe(@clientSocket)
    @clientSocket.pipe(@serverSocket)

    @connect(@clientSocket)

    @on('socket.close', @end)

  end: =>
    @clientSocket.end()
    @serverSocket.end()
    @clientSocket.removeAllListeners()
    @serverSocket.removeAllListeners()

module.exports = Sandal
