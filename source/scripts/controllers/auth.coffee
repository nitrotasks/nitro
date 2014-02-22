User   = require '../models/user'
View   = require '../views/auth'
event  = require '../utils/event'
config = require '../utils/config'

class Auth

  constructor: ->

    @view = new View()
    @view.on 'login', @login
    @view.on 'register', @register
    @view.on 'skip', @skip

    event.on 'auth:session:token', (token) =>
      @socket()

  skip: ->
    # TODO: Do we need to set anything here?
    User.offline = yes
    event.trigger 'auth:skip'

  loadToken: (token) ->
    console.log 'loading token', token
    User.token = token
    User.authenticated = true
    event.trigger 'auth:session:token', token

  register: (name, email, password) =>
    $.ajax
      type: 'post'
      url: config.server + '/auth/register'
      data:
        name: name
        email: email
        password: password
      success: ([uid, token]) =>
        @view.trigger 'login:success'
        @loadToken(uid, token)
      error: (xhr, status, msg) =>
        @view.trigger 'register:fail', xhr.status, xhr.responseText

  login: (email, password) =>
    $.ajax
      type: 'post'
      url: config.server + '/auth/login'
      data:
        email: email
        password: password
      dataType: 'json'
      success: (data) =>
        console.log('login data', data)
        @view.trigger('login:success')
        @loadToken(data.sessionToken)
      error: (xhr, status, msg) =>
        @view.trigger 'login:fail', xhr.status, xhr.responseText

  socket: =>
    $.ajax
      type: 'get'
      url: config.server + '/api/socket'
      headers:
        Authorization: 'bearer ' + User.token
      success: (data) =>
        console.log data
        event.trigger 'auth:socket:token', data.socketToken
      error: (xhr, status, msg) =>
        console.log arguments

module.exports = Auth
