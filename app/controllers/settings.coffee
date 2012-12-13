Spine = require("spine")
Setting = require("models/setting")

class Settings extends Spine.Controller

  elements:
    ".username": "username"

  events:
    "change input": "save"
    "click .save": "save"

  constructor: ->
    super
    Setting.bind "toggle", @toggle
    Setting.bind "saved", @showFlash
    @username.val Setting.first().username

  toggle: =>
    @el.fadeToggle(300)

  save: =>
    Setting.set("username", @username.val())

module.exports = Settings
