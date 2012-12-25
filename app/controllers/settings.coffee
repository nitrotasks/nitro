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
    "click": "close"

  constructor: ->
    super
    Setting.bind "show", @show
    @username.val Setting.get "username"
    @weekStart.val Setting.get "weekStart"
    @dateFormat.val Setting.get "dateFormat"
    @confirmDelete.prop "checked", Setting.get("confirmDelete")

  show: =>
    @el.show(0).addClass "show"

  save: =>
    Setting.set "username", @username.val()
    Setting.set "weekStart", @weekStart.val()
    Setting.set "dateFormat", @dateFormat.val()
    Setting.set "confirmDelete",  @confirmDelete.prop "checked"

  close: (e) =>
    if $(e.target).hasClass("modal")
      @el.removeClass "show"
      setTimeout ( =>
        @el.hide(0)
      ), 350

  clearData: =>
    @log "Clearing data"

module.exports = Settings
