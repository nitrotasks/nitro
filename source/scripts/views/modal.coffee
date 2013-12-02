Base = require 'base'

# Transition duration
duration = 350

# The base Modal class
class Modal extends Base.View

  @modals = []

  @container = '.modals'

  @current: null

  @displayed: no

  @init: =>
    @container = $ @container

    for modal in @modals
      modal.init()

    @container.on 'click', =>
      if event.target.className.indexOf('modals') > -1
        @current.hide()


  # Show container
  @show: =>
    return if @displayed
    @displayed = yes
    @container.show()
    requestAnimationFrame =>
      @container.addClass 'show'

  # Hide container
  @hide: =>
    return unless @displayed
    @displayed = no
    @container.removeClass 'show'
    setTimeout =>
      @container.hide()
    , duration

  constructor: (opts) ->
    Base.touchify(opts.events) if opts.events
    super

    @displayed = no
    Modal.modals.push this

  init: =>
    @bind $ @selector

  minimize: =>
    return unless @displayed
    @displayed = no
    @el.removeClass 'show'
    setTimeout =>
      @el.hide()
    , duration

  maximize: =>
    return if @displayed
    @displayed = yes
    @el.show()
    requestAnimationFrame =>
      @el.addClass 'show'

  show: =>
    if Modal.current?.displayed
      Modal.current.minimize()
      setTimeout @show, duration/4
      return

    Modal.show()
    Modal.current = this
    @maximize()

  hide: =>
    Modal.hide()
    @minimize()

module.exports = Modal