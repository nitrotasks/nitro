user   = require '../models/user'
View   = require '../views/auth'
event  = require '../utils/event'
config = require '../utils/config'

class Auth

  constructor: ->

    @view = new View()
    @view.on 'login', @login
    @view.on 'register', @register
    @view.on 'skip', @skip

  skip: =>
    # TODO: Do we need to set anything here?
    user.offline = yes
    event.trigger 'auth:skip'

  loadToken: (id, token) ->
    user.uid = id
    user.token = token
    event.trigger 'auth:token', id, token

  register: (name, email, password) =>
    $.ajax
      type: 'post'
      url: "http://#{ config.server }/register"
      data:
        name: name
        email: email
        password: password
      success: (status) =>
        @view.trigger 'register:success'
      error: (xhr, status, msg) =>
        @view.trigger 'register:fail', xhr.status, xhr.responseText

  login: (email, password) =>
    $.ajax
      type: 'post'
      url: "http://#{ config.server }/login"
      data:
        email: email
        password: password
      dataType: 'json'
      success: ([uid, token, email, name, pro]) =>
        @view.trigger 'login:success'
        user.pro   = pro
        user.name  = name
        user.email = email
        @loadToken(uid, token)
      error: (xhr, status, msg) =>
        @view.trigger 'login:fail', xhr.status, xhr.responseText

module.exports = Auth
