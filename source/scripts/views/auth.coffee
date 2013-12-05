Base = require 'base'
user = require '../models/user'

class Auth extends Base.View

  el: '.auth'

  template: require '../templates/auth'

  ui:

    # Form
    name: '.auth-name'
    email: '.auth-email'
    password: '.auth-password'

    # Buttons
    buttons: 'button'

    # Messages
    loginMessage: '.note-login'
    successMessage: '.note-success'
    errorMessage: '.error'

  events: Base.touchify
    'click .login':        'submit'
    'click .register':     'submit'
    'click .switch-mode':  'switchMode'
    'click .offline':      'skipAuth'
    'keydown input':       'keydown'

  constructor: ->
    super

    @mode = 'login'

    @listen user,
      'login': @hide

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
  hide: (options = {}) =>
    if options.animate is false
      @el.hide()
    else
      @el.fadeOut(300)
    @ui.buttons.removeClass('active')

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

        when 'login'
          @trigger 'login',
            @ui.email.val(),
            @ui.password.val()

        when 'register'
          @trigger 'register',
            @ui.name.val(),
            @ui.email.val(),
            @ui.password.val()

  # Check if the form is valid
  valid: =>
    if @mode
      valid = @ui.email.val().length and
              @ui.password.val().length
    else
      valid = @ui.email.val().length and
              @ui.password.val().length and
              @ui.name.val().length
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
      when 'login' then @ui.email.focus()
      when 'register' then @ui.name.focus()

  # Skip authentication
  skipAuth: =>
    @hide()
    @trigger 'skip'

  hideError: =>
    @ui.errorMessage.removeClass('populated')

  showError: (status, message) ->
    @ui.errorMessage
      .addClass('populated')
      .html @template status, message

  showSuccess: ->
    @hideError()
    @ui.loginMessage.addClass 'hidden'
    @ui.successMessage.removeClass 'hidden'

  spinner: (status) ->
    @ui.buttons.toggleClass 'active', status

module.exports = Auth
