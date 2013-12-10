Base = require 'base'
delay = require '../utils/timer'

# Element selectors
ui =
  container: '.settings'
  tabBar: '.tabs'
  title: '.pane .title'

# Tab settings
defaultTab = 'general'
tabs = {}

# TODO: Move this into a config file of sorts
DURATION = 150

class Tab extends Base.View

  @current: null

  @init: ->
    ui.container = $ ui.container
    ui.tabBar = ui.container.find ui.tabBar
    ui.title = ui.container.find ui.title

    for id, tab of tabs
      tab.init()

    # Show default tab
    @current = @get defaultTab
    @current.show()

  @get: (id) ->
    return tabs[id]

  constructor: (opts) ->
    # Base.touchify @events
    super

    # Store record of it
    tabs[@id] = this

    for method in @methods
      @[method] = @[method].bind(this)

  init: =>
    @bind ui.container.find @selector
    @tab = ui.tabBar.find "li[data-id=#{ @id }]"
    @tab.on Base.touchify.event, @show
    @load()

  show: =>
    
    # Set current tab in sidebar
    Tab.current?.tab.removeClass 'current'
    @tab.addClass 'current'

    # Hide current pane
    Tab.current?.el.addClass 'exitPage'
    ui.title.addClass 'exitPage'

    delay DURATION, =>

      # Show new tab
      Tab.current.el.removeClass 'current exitPage'
      Tab.current = this
      @el.addClass 'current enterPage'

      # Set pane title
      ui.title
        .removeClass('exitPage')
        .addClass('enterPage')
        .text Tab.current.tab.text()

      delay DURATION, ->
        ui.title.removeClass 'enterPage'

module.exports = Tab
