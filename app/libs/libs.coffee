# Load non-npm libraries
require './modal'
require './jquery-ui'
require './touch'

module.exports =
  touch:     is_touch_device
  modal:     $.fn.modal
  jqueryui:  $
