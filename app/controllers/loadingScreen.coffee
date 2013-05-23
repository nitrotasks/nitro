
Spine = require 'spine'
$ = Spine.$

class LoadingScreen extends Spine.Controller

  constructor: ->
    super

  hide: =>
    @el.addClass('hidden')

  show: =>
    @el.removeClass('hidden')

module.exports = LoadingScreen
