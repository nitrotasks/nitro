Spine = require("spine")

# Detect touch devices
isMobile = window.ontouchend isnt undefined

# Replace click events with touchend events
Spine.touchify = (events={}) ->
  return events unless isMobile
  for event, action of events
    touchEvent = event.replace(/^click/, "touchend")
    if touchEvent[0...8] is "touchend"
      delete events[event]
      events[touchEvent] = action
  return events

module.exports = Spine.touchify
