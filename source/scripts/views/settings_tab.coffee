
Base = require 'base'

container = '.settings'
tabBar = '.tabs'

defaultTab = 'general'

tabs = {}

class Tab extends Base.View

  @current: null

  @init: ->
    container = $ container
    tabBar = container.find tabBar

    for id, tab of tabs
      tab.init()

    @current = @get defaultTab

  @get: (id) ->
    return tabs[id]

  constructor: (opts) ->
    Base.touchify @events
    super

    # Store record of it
    tabs[@id] = this

    for method in @methods
      @[method] = @[method].bind(this)

  init: =>
    @bind container.find @selector
    @tab = tabBar.find "li[data-id=#{ @id }]"
    @tab.on Base.touchify.event, @show
    @load()

  show: =>
    Tab.current.tab.removeClass 'current'
    Tab.current.el.removeClass 'current'
    Tab.current = this
    @el.addClass 'current'
    @tab.addClass 'current'

module.exports = Tab