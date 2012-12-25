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
    "click": "close"
    "click .tabs li": "tabSwitch"
    "click .night-mode": "toggleNight"

  constructor: ->
    super
    Setting.bind "show", @show
    @username.val Setting.get "username"
    @weekStart.val Setting.get "weekStart"
    @dateFormat.val Setting.get "dateFormat"
    @confirmDelete.prop "checked", Setting.get("confirmDelete")
    @nightMode.prop "checked", Setting.get("night")

  show: =>
    @el.show(0).addClass "show"

  save: =>
    Setting.set "username", @username.val()
    Setting.set "weekStart", @weekStart.val()
    Setting.set "dateFormat", @dateFormat.val()
    Setting.set "confirmDelete",  @confirmDelete.prop "checked"
    Setting.set "night",  @nightMode.prop "checked"

  close: (e) =>
    if $(e.target).hasClass "modal"
      @el.removeClass "show"
      setTimeout ( =>
        @el.hide 0
      ), 350

  tabSwitch: (e) =>
    @el.find(".current").removeClass "current"
    # One hell of a line of code, but it switches tabs. I'm amazing.
    @el.find("div." + $(e.target).addClass("current").attr("data-id")).addClass "current"

  toggleNight: (e) =>
    $("html").toggleClass "dark"

  clearData: =>
    @log "Clearing data"

module.exports = Settings
