Base = require 'base'

# The base Modal class
class Modal extends Base.View

  constructor: (opts) ->
    Base.touchify(opts.events)
    super

    @el.on 'click.modal, touchend.modal', (event) =>
      if event.target.className.indexOf('modal') > -1 then @hide()

  state: off

  show: ->
    return unless @state is off
    @state = on
    @el.show().addClass('show')
    if @onShow then @onShow()

  hide: ->
    return unless @state is on
    @state = off
    @el.removeClass('show')
    setTimeout =>
      @el.hide(0)
      if @onHide then @onHide()
    , 350

module.exports = Modal