Base = require 'base'
delay        = require '../utils/timer'

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
    # Base.touchify @events
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
    Tab.current.el.addClass 'exitPage'
    $(".pane .title").addClass('exitPage')
    delay(150, =>
      Tab.current.el.removeClass('current exitPage')
      Tab.current = this
      @el.addClass 'current enterPage'
      @tab.addClass 'current'
      $(".pane .title").removeClass("exitPage").addClass('enterPage').text(Tab.current.tab.text())
      delay(150, ->
        $(".pane .title").removeClass("enterPage")
      )
    )

module.exports = Tab
