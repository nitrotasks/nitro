Spine = require 'spine'
Setting = require 'models/setting'
Cookies = require 'utils/cookies'
CONFIG = require 'utils/conf'
$ = Spine.$

class Auth extends Spine.Controller

  elements:
    '.form': 'form'
    '.auth-name': 'name'
    '.auth-email': 'email'
    '.auth-password': 'password'
    '.login': 'loginBtn'
    '.register': 'registerBtn'
    '.note-login': 'loginNote'
    '.note-register': 'registerNote'
    '.note-success': 'successNote'
    '.error': 'errorNote'

  events:
    'click .login': 'buttonLogin'
    'click .register': 'buttonRegister'
    'click .switch-mode': 'switchMode'
    'click .offline': 'noAccount'
    'click .service': 'oauthLogin'
    'keydown input': 'enterKey'

  constructor: ->
    Spine.touchify(@events)
    super

    # True  = login
    # False = register
    @mode = true

    Setting.bind 'login', =>
      @el.fadeOut(300)
      @form.removeClass('ajax')

    @handleOauth()

  enterKey: (e) =>
    if e.keyCode is 13
      if @mode
        @buttonLogin()
      else
        @buttonRegister()

  buttonLogin: =>
    # Check for empty fields
    if @email.val() is '' or @password.val() is ''
      @errorNote.addClass('populated').text('Please fill out all fields')
    else
      @form.addClass('ajax')
      @login @getData()
    return true

  buttonRegister: =>
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
    Setting.set('noAccount', true)
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
    Setting.set('uid', id)
    Setting.set('token', token)
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

        if Setting.get('noAccount') is false
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
        Setting.set('user_name', name)
        Setting.set('user_email', email)
        Setting.set('pro', pro)

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

  handleOauth: =>
    oauth = Setting.get('oauth')
    return unless oauth?

    token = oauth.token
    secret = oauth.secret
    service = oauth.service
    Setting.delete('oauth')

    $.ajax
      type: 'post'
      url: "http://#{CONFIG.server}/oauth/access"
      data:
        service: service
        token: token
        secret: secret
      success: (access) =>
        console.log access
        $.ajax
          type: 'post'
          url: "http://#{CONFIG.server}/oauth/login"
          data:
            service: service
            token: access.oauth_token
            secret: access.oauth_token_secret
          success: ([uid, token, email, name]) =>
            @saveToken(uid, token)
            Setting.set('user_name', name)
            Setting.set('user_email', email)
          fail: ->
            console.log arguments

module.exports = Auth
