Base = require 'base'
Pref = require '../models/pref'
delay = require '../utils/delay'

DELAY = 1000 * 60 * 60 * 12 # 12 hours
MORNING = 7
EVENING = MORNING + 12

class NightMode extends Base.View

  el: 'html'

  constructor: ->
    super

    @listen Pref,
      'change:night': @toggle

    @toggle Pref.night


  ###
   * (private) Turn
   *
   * Set night mode. Default on.
   *
   * - [value] (boolean) - turn it off or on
  ###

  _turn: (value=true) ->
    @el.toggleClass 'dark', value


  ###
   * (private) Auto Timer
   *
   * Starts a recursive timer for the 'auto' mode
  ###

  _autoTimer: ->
    now = new Date()
    hours = now.getHours()

    nextRun = new Date()
    nextRun.setMinutes 0
    nextRun.setSeconds 0

    # Run it tomorrow morning
    if hours > EVENING
      nextRun.setHours MORNING
      nextRun.setDate nextRun.getDate() + 1

    # Run it this morning
    else if hours < MORNING
      nextRun.setHours MORNING

    # Run it this evening
    else
      nextRun.setHours EVENING

    state = (hours > EVENING or hours < MORNING)
    @_turn state

    delay nextRun.getTime() - now.getTime(), =>
      @_turn not state
      @_autoTimer()


  ###
   * Toggle
   *
   * Handles light, dark, and auto modes
   *
   * - value (int) : value to set to
  ###

  toggle: (value) =>

    switch value

      when Pref.NIGHT_LIGHT
        @_turn off

      when Pref.NIGHT_DARK
        @_turn on

      when Pref.NIGHT_AUTO
        @_autoTimer()

module.exports = NightMode
