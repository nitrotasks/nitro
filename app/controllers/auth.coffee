Spine = require "spine"

class Auth extends Spine.Controller

  elements:
    ".form": "form"
    ".name input": "name"
    ".email input": "email"
    ".password input": "password"

  events:
    "click button": "buttonClick"
    "click .message a": "toggleMode"

  constructor: ->
    super
    @mode = "login"

  buttonClick: =>
    data = @getData()
    switch @mode
      when "login" then @login data
      when "sign-up" then @register data
    true

  toggleMode: =>
    @form.removeClass @mode
    @mode = if @mode is "login" then "sign-up" else "login"
    @form.addClass @mode
    true

  getData: ->
    name: @name.val()
    email: @email.val()
    password: @password.val()

  register: (data) ->
    @log data

  login: (data) ->
    @log data

module.exports = Auth
