Pref = require '../../models/pref'
Tab = require '../settings_tab'
exportModal = require '../../views/modal/export'

settings =
  weekStart: '#input-week-start'
  dateFormat: '#input-date-format'
  moveCompleted: '#input-move-completed'
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
      val = Pref[setting]
      if el.attr('type') is 'checkbox'
        el.attr 'checked', val
      else if el.hasClass('control')
        el.find('[value=' + val + ']').prop("checked", true)
      else
        el.val val

  clearData: =>
    localStorage.clear()
    document.location.reload()

  exportData: =>
    exportModal.run()

Pref.on 'change', ->
  module.exports.load()

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
      else if el.hasClass('control')
        val = el.find(":checked").val()

        num = parseInt val, 10
        if not isNaN num
          val = num

      else
        val = el.val()

      console.log setting, val

      Pref[setting] = val


module.exports = new Tab options
