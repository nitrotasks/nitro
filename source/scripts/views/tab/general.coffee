Setting = require '../../models/setting'
Tab = require '../settings_tab'
exportModal = require '../../views/modal/export'

settings =
  weekStart: '#input-week-start'
  dateFormat: '#input-date-format'
  completedDuration: '#input-completed-duration'
  confirmDelete: '#input-confirm-delete'
  night: '#input-night-mode'

options =

  id: 'general'

  selector: '.general'

  ui: {}
  methods: ['clearData', 'exportData']
  events:
    'click .clear-data': 'clearData'
    'click .export-data': 'exportData'

  # Load settings from storage
  load: ->
    for setting of settings
      el = @ui[setting]
      val = Setting[setting]
      if el.attr('type') is 'checkbox'
        el.attr 'checked', val
      else
        el.val val

  clearData: =>
    localStorage.clear()
    document.location.reload()

  exportData: =>
    exportModal.run()

# Load settings
for setting, element of settings

  # Generate methods, events and ui
  options.methods.push setting
  options.ui[setting] = element
  options.events['change ' + element] = setting

  # Handle settings being changed
  do (setting, element) ->
    options[setting] = ->
      el = @ui[setting]
      if el.attr('type') is 'checkbox'
        val = el.is ':checked'
      else
        val = el.val()
      Setting[setting] = val


module.exports = new Tab options
