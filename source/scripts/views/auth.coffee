Base    = require 'base'
Setting = require '../models/setting'

class Auth extends Base.Controller

  template: require '../templates/auth'

  elements:

    # Form
    '.form':           'form'
    '.auth-name':      'name'
    '.auth-email':     'email'
    '.auth-password':  'password'

    # Buttons
    'button':          'buttons'
    '.login':          'loginBtn'
    '.register':       'registerBtn'

    # Messages
    '.note-login':     'loginNote'
    '.note-register':  'registerNote'
    '.note-success':   'successNote'
    '.error':          'errorNote'

  events:
    'click .login':        'submit'
    'click .register':     'submit'
    'click .switch-mode':  'switchMode'
    'click .offline':      'skipAuth'
    'keydown input':       'keydown'

  constructor: ->
    Base.touchify(@events)
    super

    @el = $('.auth')
    @bind()

    @mode = 'login'

    @listen Setting,
      'offline login': @hide

    @on 'register:success', =>
      @spinner(off)
      @setMode('login')
      @hideError()

  # Hide login screen
  hide: =>
    @el.fadeOut(300)
    @buttons.removeClass('active')

  # Show login screen
  show: =>
    @el.fadeIn(300)

  # Submit form on enter
  keydown: (e) =>
    if e.keyCode is 13 then @submit()

  # Submit the form data
  submit: =>
    if @valid
      @spinner true
      switch @mode
        when 'login' then @trigger 'login', @email.val(), @password.val()
        when 'register' then @trigger 'register', @email.va(), @password.val(), @name.val()

  # Check if the form is valid
  valid: =>
    if @mode
      valid = @email.val().length and @password.va().length
    else
      valid = @email.val().length and @password.val().length and @name.val().length
    if not valid
      @error('Please  fill out all fields')
    return valid

  # Switch form between login and register modes
  switchMode: (@mode) =>
    @el.toggleClass 'login', @mode is 'login'
    @hideError()
    switch @mode
      when 'login' then @email.focus()
      when 'register' then @name.focus()

  hideError: =>
    @errorMessage
      .removeClass 'populated'
      .empty()

  showError: (type, message) ->
    @errorNote
      .addClass 'populated'
      .html @template message

  spinner: (status) ->
    @buttons.toggleClass('active', status)

module.exports = Auth
