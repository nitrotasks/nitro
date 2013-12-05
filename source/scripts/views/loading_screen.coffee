Base  = require 'base'
event = require '../utils/event'

class LoadingScreen extends Base.View

  el: '.loading-screen'

  constructor: ->
    super

    event.on 'app:ready', @hide

  hide: =>
    @el.fadeOut(300)
    # @el.addClass('hidden')

  show: =>
    @el.fadeIn(300)
    # @el.removeClass('hidden')

module.exports = LoadingScreen
