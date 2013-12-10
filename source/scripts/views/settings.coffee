Base   = require 'base'
Modal   = require '../views/modal/settings'
event = require '../utils/event'

# Load tabs
Tab     = require '../views/settings_tab'
General  = require '../views/tab/general'
Account  = require '../views/tab/account'
Language = require '../views/tab/language'
About    = require '../views/tab/about'

delay        = require '../utils/timer'

# Animation duration
DURATION = 150

class Settings extends Base.View

  el: '.settings'

  ui:
    'pane': '.pane'
    'paneTitle': '.pane .title'

  events:
    'click .menu .title img': 'back'

  constructor: ->
    super

    # FIXME: This is just a placeholder
    $('#open-settings-button').click @show

    # Show settings
    event.on 'settings:show', @show

    @ui.menu = $ '.pane .title, .pane .current, .settings .menu'
    @ui.entrance = $ '.main .entrance, .sidebar .wrapper'

  show: =>
    @ui.entrance
      .removeClass('enterPage')
      .addClass('exitPage')

    delay DURATION, =>
      @el.addClass 'show'
      @ui.menu
        .removeClass('exitPage')
        .addClass("enterPage")

  back: =>
    @ui.menu
      .removeClass('enterPage')
      .addClass('exitPage')

    delay DURATION, =>
      @el.removeClass 'show'
      @ui.entrance
        .addClass('enterPage')
        .removeClass('exitPage')

module.exports = Settings
