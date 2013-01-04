Spine = require "spine"
Setting = require "models/setting"
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
    @el.fadeOut(300)
    true

  getData: =>
    name: @name.val()
    email: @email.val()
    password: @password.val()

  register: (data) ->
    $.ajax
      type: "post"
      url: "http://localhost:5000/api/v0/auth/register"
      data: data
      success: (success) ->
        console.log "Register: ", success

  login: (data) ->
    $.ajax
      type: "post"
      url: "http://localhost:5000/api/v0/auth/login"
      data: data
      success: (success) ->
        console.log "Login: ", success

module.exports = Auth
