Base = require 'base'

# Detect touch devices
isMobile = window.ontouchend isnt undefined

# Replace click events with touchend events
Base.touchify = (events={}) ->
  return events unless isMobile
  console.log events
  for event, action of events
    touchEvent = event.replace /^click/, 'touchend'
    if touchEvent[0...8] is 'touchend'
      delete events[event]
      events[touchEvent] = action
  return events

module.exports = Base.touchify
