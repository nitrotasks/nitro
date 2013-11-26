# Load non-npm libraries
require './jquery-ui'
require './touch'
require './jquery.autosize'

module.exports =
  jqueryui:  $
  touch:     is_touch_device
