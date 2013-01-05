Spine = require "spine"
Setting = require "models/setting"
Cookies = require "utils/cookies"
$ = Spine.$

class Auth extends Spine.Controller

  elements:
    ".form": "form"
    ".auth-name": "name"
    ".auth-email": "email"
    ".auth-password": "password"

  events:
    "click .sign-in": "buttonSignin"
    "click .register": "buttonRegister"
    "click .offline": "offlineMode"

  constructor: ->
    super
    @mode = "login"
    Setting.bind "login", @startApp
    # If the user is in Offline Mode, then hide the login form
    if Setting.get("offlineMode") then @el.hide()

  buttonSignin: =>
    @login @getData()
    true

  buttonRegister: =>
    @register @getData()
    true

  offlineMode: =>
    @log "Going into offline mode"
    Setting.set "offlineMode", true
    @startApp()
    true

  getData: =>
    name: @name.val()
    email: @email.val()
    password: @password.val()

  saveToken: (id, token) ->
    Cookies.setItem "uid", id
    Cookies.setItem "token", token
    Setting.trigger "haveToken", [id, token]

  startApp: =>
    @el.fadeOut(300)

  register: (data) ->
    $.ajax
      type: "post"
      url: "http://localhost:5000/api/v0/auth/register"
      data: data
      dataType: "json"
      success: (data) =>
        @saveToken(data[0], data[1])
      error: (xhr, status, msg) =>
        @error "signup", xhr.responseText

  login: (data) ->
    console.log "logging into server"
    $.ajax
      type: "post"
      url: "http://localhost:5000/api/v0/auth/login"
      data: data
      dataType: "json"
      success: (data) =>
        @saveToken(data[0], data[1])
      error: (xhr, status, msg) =>
        @error "login", xhr.responseText

  error: (type, err) ->
    console.log "(#{type}): #{err}"

module.exports = Auth
