Base = require 'base'

# The container
container = '.modals'

# Stores all the modals
modals = []

# The base Modal class
class Modal extends Base.View

  @current: null

  @init: ->
    container = $ container

    for modal in modals
      modal.init()

    container.on 'click', =>
      if event.target.className.indexOf('modals') > -1
        Modal.current.hide()

  constructor: (opts) ->
    Base.touchify(opts.events) if opts.events
    super
    modals.push this

  init: =>
    @el = $ @selector
    @bind()

  state: off

  show: =>
    return unless @state is off
    @state = on
    Modal.current = this
    container.show()
    @el.show()
    setTimeout =>
      container.addClass 'show'
      @el.addClass 'show'
    , 1
    if @onShow then @onShow()

  hide: =>
    return unless @state is on
    @state = off
    container.removeClass('show')
    @el.removeClass('show')
    setTimeout =>
      @el.hide()
      container.hide()
      if @onHide then @onHide()
    , 350

module.exports = Modal