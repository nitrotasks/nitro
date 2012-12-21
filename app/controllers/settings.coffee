Spine = require("spine")
Setting = require("models/setting")

class Settings extends Spine.Controller

  elements:
    ".language": "language"
    ".week-start": "weekStart"
    ".date-format": "dateFormat"
    ".confirm-delete": "confirmDelete"
    ".search-mode": "searchMode"
    ".username": "username"

  events:
    "change input": "save"
    "change select": "save"
    "click .clear-data": "clearData"

  constructor: ->
    super
    Setting.bind "toggle", @toggle
    Setting.bind "saved", @showFlash
    @username.val Setting.get "username"
    @weekStart.val Setting.get "weekStart"
    @dateFormat.val Setting.get "dateFormat"

  toggle: =>
    @el.toggleClass("show")

  save: =>
    Setting.set "username", @username.val()
    Setting.set "weekStart", @weekStart.val()
    Setting.set "dateFormat", @dateFormat.val()

  clearData: =>
    @log "Clearing data"

module.exports = Settings
