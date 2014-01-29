Pref = require '../../models/pref'
Tab = require '../settings_tab'

language = new Tab

  id: 'language'

  selector: '.language'

  events:
    'click a': 'setLanguage'

  methods: []

  load: ->
    el = $ "[data-value=#{ Pref.language }]"
    el.addClass 'selected'

  setLanguage: (event) ->
    Pref.language = $(this).data 'value'
    # document.location.reload()

module.exports = language
