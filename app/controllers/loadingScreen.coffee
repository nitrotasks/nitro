
Spine = require 'spine'
$ = Spine.$

class LoadingScreen extends Spine.Controller

  constructor: ->
    super
    Setting.bind('offline', @hide)

  hide: =>
    @el.fadeOut(300)
    # @el.addClass('hidden')

  show: =>
    @el.fadeIn(300)
    # @el.removeClass('hidden')

module.exports = LoadingScreen
