Spine = require "spine"
Setting = require "models/setting"
Cookies = require "utils/cookies"
CONFIG = require "utils/conf"
$ = Spine.$

class Auth extends Spine.Controller

  elements:
    ".form": "form"
    ".auth-name": "name"
    ".auth-email": "email"
    ".auth-password": "password"
    ".sign-in": "signInBtn"
    ".register": "registerBtn"
    ".note": "note"
    ".error": "errorElem"

  events:
    "click .sign-in": "buttonSignin"
    "click .register": "buttonRegister"
    "click .sign-up": "buttonSignup"
    "click .offline": "offlineMode"
    "click .service.dropbox": "dropboxLogin"

  constructor: ->
    super
    @mode = "login"
    Setting.bind "login", @startApp
    # If the user is in Offline Mode, then hide the login form
    if Setting.get("offlineMode") then @el.hide()
    @handleOauth()

  buttonSignin: =>
    if @email.val() is "" or @password.val() is ""
      @errorElem.addClass("populated").text "Please fill out all fields"
    else
      @signInBtn.addClass "ajax"
      @login @getData()
      true

  buttonSignup: =>
    @name.toggle()
    @registerBtn.toggle()
    @signInBtn.toggle()
    @errorElem.removeClass("populated").text ""

    if @note.hasClass("registerSlide")
      @email.focus()
      @note.removeClass("registerSlide").html 'Don\'t have an account? <a href="#" class="sign-up">Sign up for free</a>.'
    else
      @name.focus()
      @note.addClass("registerSlide").html "Already have an account? <a href='#' class='sign-up'>Sign in</a>."

  buttonRegister: =>
    if @email.val() is "" or @password.val() is "" or @name.val() is ""
      @errorElem.addClass("populated").text "Please fill out all fields"
    else
      @registerBtn.addClass "ajax"
      @register @getData()
      true

  offlineMode: =>
    @log "Going into offline mode"
    Setting.set "offlineMode", true
    @startApp()

    # Make default tasks
    Task.default()

    true

  getData: =>
    name: @name.val()
    email: @email.val()
    password: @password.val()

  saveToken: (id, token) ->
    Setting.set("uid", id)
    Setting.set("token", token)
    Setting.trigger "haveToken", [id, token]

  startApp: =>
    @el.fadeOut(300)

  register: (data) ->
    $.ajax
      type: "post"
      url: "http://#{CONFIG.server}/api/v0/register"
      data: data
      success: (data) =>
        console.log data
        # @saveToken(data[0], data[1])

        @signInBtn.removeClass "ajax"
        @registerBtn.removeClass "ajax"

        # User Message
        $(".auth .sign-up").trigger("click")
        $(".auth .note").text "Thanks for signing up! We've sent you a confirmation email."

        @errorElem.removeClass("populated").text ""

        if Setting.get("offlineMode") is false
          Task.default()

      error: (xhr, status, msg) =>
        @error "signup", xhr.responseText

  login: (data) ->
    console.log "logging into server"
    $.ajax
      type: "post"
      url: "http://#{CONFIG.server}/api/v0/login"
      data: data
      dataType: "json"
      success: ([uid, token, email, name]) =>
        @saveToken(uid, token)
        Setting.set("user_name", name)
        Setting.set("user_email", email)

        @signInBtn.removeClass "ajax"
        @registerBtn.removeClass "ajax"

        @errorElem.removeClass("populated").text ""

        # In case it's been set
        Setting.set "offlineMode", false
      error: (xhr, status, msg) =>
        @error "login", xhr.responseText

  error: (type, err) ->
    @signInBtn.removeClass "ajax"
    @registerBtn.removeClass "ajax"

    console.log "(#{type}): #{err}"
    @errorElem.addClass "populated"
    if err is "err_bad_pass"
      @errorElem.html "Incorrect email or password. <a href='http://#{CONFIG.server}/api/v0/auth/forgot'>Forgot?</a>"
    else if err is "err_old_email"
      @errorElem.text "Account already in use"
    else
      @errorElem.text "#{err}"

  dropboxLogin: =>
    $.ajax
      type: "get"
      url: "http://#{CONFIG.server}/api/v0/dropbox/request"
      data:
        url: location.href
      success: (request) =>
        Setting.set "oauth"
          service: "dropbox"
          token: request.oauth_token
          secret: request.oauth_token_secret
        location.href = request.authorize_url

  handleOauth: =>
    oauth = Setting.get("oauth")
    if oauth?
      console.log oauth
      switch oauth.service
        when "dropbox"
          $.ajax
            type: "post"
            url: "http://#{CONFIG.server}/api/v0/dropbox/access"
            data:
              token: oauth.token
              secret: oauth.secret
            success: (access) =>
              console.log access
              $.ajax
                type: "post"
                url: "http://#{CONFIG.server}/api/v0/dropbox/login"
                data:
                  token: access.oauth_token
                  secret: access.oauth_token_secret
                success: ([uid, token, name, email]) =>
                  @saveToken(uid, token)
                  Setting.set("user_name", name)
                  Setting.set("user_email", email)
                fail: ->
                  console.log arguments
      Setting.delete("oauth")

module.exports = Auth
