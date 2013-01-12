Spine = require("spine")
Setting = require("models/setting")
Cookies = require("utils/cookies")

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
    "#notify-regualr": "notifyRegular"
    ".disabler": "disabler"

  events:
    "change input": "save"
    "change select": "save"
    "click .clear-data": "clearData"
    "click .tabs li": "tabSwitch"
    "click .night-mode": "toggleNight"
    "click .language a": "changeLanguage"
    "click .login": "login"
    "click #notify-toggle": "toggleNotify"

  constructor: ->
    super
    Setting.bind "show", @show
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

    $('html').addClass('proenable') if Setting.isPro()

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

  clearData: =>
    @log "Clearing data"
    localStorage.clear()
    Cookies.removeItem("uid")
    Cookies.removeItem("token")


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
        @disabler.prop("disabled", false).removeClass("disabled")
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
