Setting = require '../../models/setting'
Tab = require '../settings_tab'

language = new Tab

  id: 'language'

  selector: '.language'

  events:
    'click a': 'setLanguage'

  methods: []

  load: ->
    el = $ "[data-value=#{ Setting.language }]"
    el.addClass 'selected'

  setLanguage: (event) ->
    Setting.language = $(this).data 'value'
    # document.location.reload()

module.exports = language
