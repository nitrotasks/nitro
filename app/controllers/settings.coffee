Spine = require("spine")
Setting = require("models/setting")

class Settings extends Spine.Controller

  elements:
    ".language": "language"
    ".week-start": "weekStart"
    ".date-format": "dateFormat"
    ".confirm-delete": "confirmDelete"
    ".username": "username"

  events:
    "change input": "save"
    "change select": "save"
    "click .clear-data": "clearData"

  constructor: ->
    super
    Setting.bind "toggle", @toggle
    @username.val Setting.get "username"
    @weekStart.val Setting.get "weekStart"
    @dateFormat.val Setting.get "dateFormat"
    @confirmDelete.prop "checked", Setting.get("confirmDelete")

  toggle: =>
    @el.show(0).toggleClass "show"

  save: =>
    Setting.set "username", @username.val()
    Setting.set "weekStart", @weekStart.val()
    Setting.set "dateFormat", @dateFormat.val()
    Setting.set "confirmDelete",  @confirmDelete.prop "checked"

  clearData: =>
    @log "Clearing data"

module.exports = Settings
