Base = require 'base'
Setting = require '../models/setting'

class NightMode extends Base.View

  el: 'html'

  constructor: ->
    super

    @listen Setting,
      'change:night': @toggle

    @toggle Setting.night

  toggle: (value) =>
    hours = new Date().getHours()
    if value is 'auto'
      nextRun = new Date()
      nextRun.setMinutes 0

      if hours > 19
        # turn it off at 7am tomorrow
        nextRun.setHours 7
        nextRun.setDate nextRun.getDate()+1
      else if hours < 7
        # turn it off at 7am today
        nextRun.setHours 7
      else
        # turn it off 7pm today
        nextRun.setHours 21

      setTimeout(=>
        @el.toggleClass 'dark'
        setInterval(=>
          @el.toggleClass 'dark'
        , 43200000)
      , nextRun.getTime() - new Date().getTime())

    if value is 'dark' or value is 'auto' and (hours > 19 or hours < 7)
      @el.addClass 'dark'
    else if value is 'light'
      @el.removeClass 'dark'

module.exports = NightMode
