Setting = require '../models/setting'
View    = require '../views/auth'
Event   = require '../utils/event'
config  = require '../utils/config'

class Auth

  constructor: ->
    window.view = @view = new View()
    @view.on 'login', @login
    @view.on 'register', @register
    @view.on 'skip', @skip

  skip: =>
    # TODO: Do we need to set anything here?
    Event.trigger 'auth:skip'

  loadToken: (id, token) ->
    Setting.uid = id
    Setting.token = token
    Event.trigger 'auth:token', id, token

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
        @view.trigger 'register:fail', xhr.responseText

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
        Setting.pro        = pro
        Setting.user_name  = name
        Setting.user_email = email
        @loadToken(uid, token)
      error: (xhr, status, msg) =>
        @view.trigger 'login:fail', xhr.responseText

module.exports = Auth
