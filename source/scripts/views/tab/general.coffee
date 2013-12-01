
Setting = require '../../models/setting'
Tab = require '../settings_tab'

settings =
  'weekStart'         : '#input-week-start'
  'dateFormat'        : '#input-date-format'
  'completedDuration' : '#input-completed-duration'
  'confirmDelete'     : '#input-confirm-delete'
  'night'             : '#input-night-mode'

options =

  id: 'general'

  selector: '.general'

  elements: {}
  methods: []
  events: {}

  # Load settings from storage
  load: ->
    for setting of settings
      el = @[setting + 'El']
      val = Setting[setting]
      if el.attr('type') is 'checkbox'
        el.attr 'checked', val
      else
        el.val val


# Load settings
for setting, element of settings
  elementName = setting + 'El'

  # Generate methods, events and elements
  options.methods.push setting
  options.elements[element] = elementName
  options.events['change ' + element] = setting

  # Handle settings being changed
  do (setting, elementName) ->
    options[setting] = ->
      el = @[elementName]
      if el.attr('type') is 'checkbox'
        val = el.is ':checked'
      else
        val = el.val()
      Setting[setting] = val


module.exports = new Tab options