Spine = require "spine"
Setting = require "models/setting"
$ = Spine.$

class Auth extends Spine.Controller

  elements:
    ".form": "form"
    ".name input": "name"
    ".email input": "email"
    ".password input": "password"

  events:
    "click button": "buttonClick"
    "click .message a": "toggleMode"
    "click .offline": "offlineMode"

  constructor: ->
    super
    @mode = "login"
    # If the user is in Offline Mode, then hide the login form
    if Setting.get("offlineMode") then @el.hide()

  buttonClick: =>
    data = @getData()
    switch @mode
      when "login" then @login data
      when "sign-up" then @register data
    true

  toggleMode: =>
    # @form.removeClass @mode
    # @mode = if @mode is "login" then "sign-up" else "login"
    # @form.addClass @mode
    true

  offlineMode: =>
    @log "Going into offline mode"
    Setting.set "offlineMode", true
    @el.fadeOut(300)
    true

  getData: ->
    name: @name.val()
    email: @email.val()
    password: @password.val()

  register: (data) ->
    @log "Signing up", data

  login: (data) ->
    @log "Logging in", data

module.exports = Auth
