
Base = require 'base'
setting = require '../models/setting'

class LoadingScreen extends Base.Controller

  constructor: ->
    super
    setting.on 'offline', @hide

  hide: =>
    @el.fadeOut(300)
    # @el.addClass('hidden')

  show: =>
    @el.fadeIn(300)
    # @el.removeClass('hidden')

module.exports = LoadingScreen
