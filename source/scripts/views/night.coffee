Base = require 'base'
Setting = require '../models/setting'

class NightMode extends Base.View

  constructor: ->
    super

    @bind $ 'html'

    @listen Setting,
      'change:night': @toggle

    @toggle Setting.night

  toggle: (value) =>
    @el.toggleClass 'dark', value

module.exports = NightMode
