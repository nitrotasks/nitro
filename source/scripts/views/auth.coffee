Base    = require 'base'
$       = require 'jqueryify'
Task    = require '../models/task'
Setting = require '../models/setting'
Cookies = require '../libs/cookies'
CONFIG  = require '../utils/conf'

class Auth extends Base.Controller

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
    'click .login':        'login'
    'click .register':     'register'
    'click .switch-mode':  'switchMode'
    'click .offline':      'noAccount'
    'click .service':      'oauthLogin'
    'keydown input':       'enterKey'

  constructor: ->
    Base.touchify(@events)
    super

    # True  = login
    # False = register
    @mode = true

    @listen Setting,
      'offline login': @hide

  # Hide login screen
  hide: =>
    @el.fadeOut(300)
    @buttons.removeClass('active')

  # Show login screen
  show: =>
    @el.fadeIn(300)

  enterKey: (e) =>
    if e.keyCode is 13
      if @mode
        @buttonLogin()
      else
        @buttonRegister()

  buttonLogin: =>
    @loginBtn.toggleClass('disabled active')
    return true
    # Check for empty fields
    if @email.val() is '' or @password.val() is ''
      @errorNote.addClass('populated').text('Please fill out all fields')
    else
      @form.addClass('ajax')
      @login @getData()
    return true

  buttonRegister: =>
    @registerBtn.toggleClass('disabled active')
    return true
    # Check for empty fields
    if @email.val() is '' or @password.val() is '' or @name.val() is ''
      @errorNote.addClass('populated').text 'Please fill out all fields'
    else
      @form.addClass('ajax')
      @register @getData()
    return true

  switchMode: (mode) =>
    if typeof(mode) isnt 'boolean' then mode = !@mode
    @mode = mode
    @form.toggleClass('mode-login', @mode)
    @form.toggleClass('mode-register', !@mode)
    @errorNote.removeClass('populated').empty()
    if @mode then @email.focus() else @name.focus()

  noAccount: =>
    Setting.noAccount = true
    Setting.trigger('offline')

    # Make default tasks
    # TODO: This should be part of @startApp() right?
    Task.default()

    return true

  # Retrieve login form data
  getData: =>
    console.log @mode

    name: @name.val()
    email: @email.val()
    password: @password.val()

  saveToken: (id, token) ->
    Setting.uid = id
    Setting.token = token
    Setting.trigger 'haveToken', [id, token]

  register: (data) ->
    $.ajax
      type: 'post'
      url: "http://#{CONFIG.server}/register"
      data: data
      success: (data) =>

        @form.removeClass('ajax')

        # User Message
        @switchMode(true)
        @successNote.show()

        @errorNote.removeClass("populated").empty()

        if Setting.noAccount is false
          Task.default()

      error: (xhr, status, msg) =>
        @error 'signup', xhr.responseText

  login: (data) ->
    @errorNote.empty().removeClass('populated')
    $.ajax
      type: 'post'
      url: "http://#{CONFIG.server}/login"
      data: data
      dataType: 'json'
      success: ([uid, token, email, name, pro]) =>
        @saveToken(uid, token)
        Setting.user_name = name
        Setting.user_email = email
        Setting.pro = pro

        @errorNote.removeClass('populated').empty()

        # In case it's been set
        Setting.set 'noAccount', false

      error: (xhr, status, msg) =>
        console.log 'Could not login'
        @error 'login', xhr.responseText

  error: (type, err) ->
    @form.removeClass('ajax')

    console.log "(#{type}): #{err}"
    @errorNote.addClass 'populated'
    if err is 'err_bad_pass'
      @errorNote.html "Incorrect email or password. <a href=\"http://#{CONFIG.server}/forgot\">Forgot?</a>"
    else if err is 'err_old_email'
      @errorNote.text 'Account already in use'
    else
      @errorNote.text "#{err}"

  oauthLogin: (e) =>
    service =  e.target.attributes['data-service']?.value
    return unless service in ['dropbox', 'ubuntu']
    $.ajax
      type: 'post'
      url: "http://#{CONFIG.server}/oauth/request"
      data:
        service: service
      success: (request) =>
        Setting.set 'oauth',
          service: service
          token: request.oauth_token
          secret: request.oauth_token_secret
        location.href = request.authorize_url

module.exports = Auth
