
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
    super

    element = "li[data-id=#{ @id }]"
    event = "click #{ element }"

    @elements[element] = 'tab'
    @events[event] = 'show'

    # Store record of it
    tabs[@id] = this

  init: =>
    @bind tabBar
    @slide = container.find @selector

  show: =>
    Tab.current.tab.removeClass 'current'
    Tab.current.slide.removeClass 'current'
    Tab.current = this
    @slide.addClass 'current'
    @tab.addClass 'current'

module.exports = Tab