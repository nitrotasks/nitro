Base  = require 'base'
Event = require '../utils/event'

class LoadingScreen extends Base.View

  constructor: ->
    super

    @el = $('.loading-screen')
    @bind()

    Event.on 'app:ready', @hide

  hide: =>
    @el.fadeOut(300)
    # @el.addClass('hidden')

  show: =>
    @el.fadeIn(300)
    # @el.removeClass('hidden')

module.exports = LoadingScreen
