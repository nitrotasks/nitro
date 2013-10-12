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
    '.note-login':     'loginMessage'
    '.note-success':   'successMessage'
    '.error':          'errorMessage'

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

    @on 'login:success', =>
      @spinner(off)
      @hide()

    @on 'login:fail register:fail', (status, message) =>
      @spinner(off)
      @showError(status, message)

    @on 'register:success', =>
      @spinner(off)
      @switchMode('login')
      @showSuccess()

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
    return true

  # Submit the form data
  submit: =>
    if @valid()
      @spinner true
      switch @mode
        when 'login' then @trigger 'login', @email.val(), @password.val()
        when 'register' then @trigger 'register', @name.val(), @email.val(), @password.val()

  # Check if the form is valid
  valid: =>
    if @mode
      valid = @email.val().length and @password.val().length
    else
      valid = @email.val().length and @password.val().length and @name.val().length
    if not valid
      @showError('Please  fill out all fields')
    return valid

  # Switch form between login and register modes
  switchMode: (mode) =>
    if typeof mode isnt 'string'
      @mode = if @mode is 'login' then 'register' else 'login'
    else
      @mode = mode
    @el.toggleClass 'login', @mode is 'login'
    @el.toggleClass 'register', @mode is 'register'
    @hideError()
    switch @mode
      when 'login' then @email.focus()
      when 'register' then @name.focus()

  # Skip authentication
  skipAuth: =>
    @hide()
    @trigger 'skip'

  hideError: =>
    @errorMessage
      .removeClass('populated')
      .empty()

  showError: (status, message) ->
    @errorMessage
      .addClass('populated')
      .html @template status, message

  showSuccess: ->
    @hideError()
    @loginMessage.addClass('hidden')
    @successMessage.removeClass('hidden')

  spinner: (status) ->
    @buttons.toggleClass('active', status)

module.exports = Auth
