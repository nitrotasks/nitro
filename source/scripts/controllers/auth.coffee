Setting = require '../models/setting'
View    = require '../views/auth'
Event   = require '../utils/event'
config  = require '../utils/conf'

class Auth

  constructor: ->
    @view = new View()

  skip: =>
    Event.trigger 'auth:skip'

  loadToken: (id, token) ->
    Setting.uid = id
    Setting.token = token
    Event.trigger 'auth:token', id, token

  register: (data) ->
    $.ajax
      type: 'post'
      url: "http://#{ config.server }/register"
      data: data
      success: (data) =>
        @view.trigger('register:success')
      error: (xhr, status, msg) =>
        @view.trigger 'register:error', xhr.responseText

  login: (data) ->
    $.ajax
      type: 'post'
      url: "http://#{ config.server }/login"
      data: data
      dataType: 'json'
      success: ([uid, token, email, name, pro]) =>
        @view.trigger 'login:success'
        Setting.pro        = pro
        Setting.user_name  = name
        Setting.user_email = email
        @loadToken(uid, token)
      error: (xhr, status, msg) =>
        @view.trigger 'login:error', xhr.responseText

module.exports = Auth
