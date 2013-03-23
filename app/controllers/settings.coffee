Spine = require("spine")
Setting = require("models/setting")
Cookies = require("utils/cookies")
Task = require("models/task")

class Settings extends Spine.Controller

  elements:
    ".language": "language"
    ".week-start": "weekStart"
    ".date-format": "dateFormat"
    ".completed-duration": "completedDuration"
    ".confirm-delete": "confirmDelete"
    ".username": "username"
    ".night-mode": "nightMode"
    "#notify-toggle": "notifyToggle"
    "#notify-email": "notifyEmail"
    "#notify-time": "notifyTime"
    "#notify-regular": "notifyRegular"
    ".disabler": "disabler"
    ".clear-data": "clearDataButton"
    ".clear-data-label": "clearDataLabel"

  events:
    "change input": "save"
    "change select": "save"
    "click .clear-data": "clearData"
    # "click .logout": "logout"
    "click .tabs li": "tabSwitch"
    "click .night-mode": "toggleNight"
    "click .language a": "changeLanguage"
    "click .login": "login"
    "click #notify-toggle": "toggleNotify"

  constructor: ->
    Spine.touchify(@events)
    super
    Setting.bind "show", @show
    Setting.bind "login", @account

    @username.val Setting.get "username"
    @weekStart.val Setting.get "weekStart"
    @dateFormat.val Setting.get "dateFormat"
    @completedDuration.val Setting.get "completedDuration"
    @confirmDelete.prop "checked", Setting.get("confirmDelete")
    @nightMode.prop "checked", Setting.get("night")
    $("[data-value=" + Setting.get("language") + "]").addClass "selected"

    unless Setting.get("notifications") is true and Setting.isPro() is true
      @disabler.prop("disabled", true).addClass("disabled")
      @notifyToggle.prop "checked", false

    @notifyEmail.prop "checked", Setting.get "notifyEmail"
    @notifyTime.val Setting.get "notifyTime"
    @notifyRegular.val Setting.get "notifyRegular"

    $('html').addClass('proenable') if Setting.isPro()

    @setupNotifications()

  account: =>
    # Show the proper account thing
    $(".account .signedout").hide()
    $(".account .signedin").show()

    $(".account .user-name").val(Setting.get("user_name"))
    $(".account .user-email").val(Setting.get("user_email"))

    @clearDataLabel.hide()
    @clearDataButton.text $.i18n._("Logout")

    $(".clearWrapper").css("text-align", "center")

  show: =>
    @el.modal()

  save: =>
    Setting.set "username", @username.val()
    Setting.set "weekStart", @weekStart.val()
    Setting.set "dateFormat", @dateFormat.val()
    Setting.set "completedDuration", @completedDuration.val()
    Setting.set "confirmDelete",  @confirmDelete.prop "checked"
    Setting.set "night",  @nightMode.prop "checked"
    Setting.set "notifications",  @notifyToggle.prop "checked"
    Setting.set "notifyEmail",  @notifyEmail.prop "checked"
    Setting.set "notifyTime",  @notifyTime.val()
    Setting.set "notifyRegular",  @notifyRegular.val()

    # Clear Notify Timeout
    try
      clearTimeout(settings.notifyTimeout)

    @setupNotifications()

  moveCompleted: =>
    for list in List.all()
      list.moveCompleted()

  tabSwitch: (e) =>
    @el.find(".current").removeClass "current"
    # One hell of a line of code, but it switches tabs. I'm amazing.
    @el.find("div." + $(e.target).addClass("current").attr("data-id")).addClass "current"

  toggleNight: (e) =>
    if Setting.isPro()
      $("html").toggleClass "dark"
    else
      @nightMode.prop("checked", false)
      @el.modal("hide")
      $(".modal.proventor").modal("show")
      Setting.set "night", false

  setupNotifications: =>
    if Setting.get("notifications") and Setting.isPro()

      now = Date.now()
      notifyTime = new Date()
      hour = Setting.get("notifyTime")

      notifyTime.setHours(hour)
      notifyTime.setMinutes(8)
      notifyTime.setSeconds(0)
      notifyTime.setMilliseconds(0)
      notifyTime = notifyTime.getTime()

      # If the time has passed, increment a day
      if notifyTime - now < 0
        notifyTime += 86400000

      @log "Notifying in: #{ (notifyTime - now)/1000 } seconds"

      # console.log Task.all

      @notifyTimeout = setTimeout =>
        dueNumber = 0
        upcomingNumber = 0

        for task in Task.all()
          if task.date isnt "" and task.date isnt false and !task.completed
            # Number of Tasks that have due dates
            upcomingNumber++
            # Number of Tasks that are due
            if new Date(task.date) - new Date() < 0
              dueNumber++

        console.log {due: dueNumber, upcoming: upcomingNumber}

        if Setting.get("notifyRegular") is "upcoming"
          notification = window.webkitNotifications.createNotification(
            'img/icon.png',
            'Nitro Tasks',
            'You have ' + upcomingNumber + ' tasks upcoming'
          ).show()
        else
          notification = window.webkitNotifications.createNotification(
            'img/icon.png',
            'Nitro Tasks',
            'You have ' + dueNumber + ' tasks due'
          ).show()
        @setupNotifications()
      , notifyTime - now

  logout: (e) ->
    if e? then Setting.set("offlineMode","true")
    Cookies.removeItem("uid")
    Cookies.removeItem("token")
    document.location.reload()

  clearData: =>
    if Setting.get("token")
      localStorage.clear()
      @logout()
    else
      $(".modal.settings").modal "hide"
      $(".modal.delete").modal "show"
      $(".modal.delete .true").on("click touchend", =>
        localStorage.clear()
        @logout()
        $(".modal.delete").modal "hide"
        $(".modal.delete .true").off "click touchend"
      )

      $(".modal.delete .false").on("click touchend", (e) ->
        $(".modal.delete").modal "hide"
        $(".modal.delete .false").off "click touchend"
      )

  changeLanguage: (e) =>
    # Pirate Speak is a Pro feature
    if $(e.target).attr("data-value") is "en-pi" and !Setting.isPro()
      @el.modal("hide")
      $(".modal.proventor").modal("show")
    else
      Setting.set "language", $(e.target).attr("data-value")
      window.location.reload()

  login: =>
    $('.auth').fadeIn(300)
    @el.modal("hide")

  toggleNotify: =>
    if @notifyToggle.prop("checked")
      if Setting.isPro()
        # Enable Checkboxes
        window.webkitNotifications.requestPermission ->
          console.log("Hello")
          if window.webkitNotifications.checkPermission() is 0
            console.log("Hello")
            $(".disabler").prop("disabled", false).removeClass("disabled")

          else
            Setting.set "notifications", false
            alert "You'll need to open your browser settings and allow notifications for app.nitrotasks.com"

      else
        @notifyToggle.prop("checked", false)
        # Because it gets set as true for a stupid reason
        Setting.set "notifications", false
        @el.modal("hide")
        $('.modal.proventor').modal("show")
    else
      # Disable Checkboxes
      @disabler.prop("disabled", true).addClass("disabled")



module.exports = Settings
