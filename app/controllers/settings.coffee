Spine = require("spine")
Setting = require("models/setting")

class Settings extends Spine.Controller

  elements:
    ".language": "language"
    ".week-start": "weekStart"
    ".date-format": "dateFormat"
    ".confirm-delete": "confirmDelete"
    ".username": "username"
    ".night-mode": "nightMode"

  events:
    "change input": "save"
    "change select": "save"
    "click .clear-data": "clearData"
    "click .tabs li": "tabSwitch"
    "click .night-mode": "toggleNight"
    "click .language a": "changeLanguage"
    "click .login": "login"

  constructor: ->
    super
    Setting.bind "show", @show
    @username.val Setting.get "username"
    @weekStart.val Setting.get "weekStart"
    @dateFormat.val Setting.get "dateFormat"
    @confirmDelete.prop "checked", Setting.get("confirmDelete")
    @nightMode.prop "checked", Setting.get("night")
    $("[data-value=" + Setting.get("language") + "]").addClass "selected"

  show: =>
    @el.modal()

  save: =>
    Setting.set "username", @username.val()
    Setting.set "weekStart", @weekStart.val()
    Setting.set "dateFormat", @dateFormat.val()
    Setting.set "confirmDelete",  @confirmDelete.prop "checked"
    Setting.set "night",  @nightMode.prop "checked"

  tabSwitch: (e) =>
    @el.find(".current").removeClass "current"
    # One hell of a line of code, but it switches tabs. I'm amazing.
    @el.find("div." + $(e.target).addClass("current").attr("data-id")).addClass "current"

  toggleNight: (e) =>
    $("html").toggleClass "dark"

  clearData: =>
    @log "Clearing data"

  changeLanguage: (e) =>
    Setting.set "language", $(e.target).attr("data-value")
    window.location.reload()

  login: =>
    $('.auth').fadeIn(300)
    @el.modal("hide")

module.exports = Settings
