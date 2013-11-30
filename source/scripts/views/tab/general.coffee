
Tab = require '../settings_tab'

general = new Tab

  id: 'general'

  selector: '.general'

  events:
    'change #input-week-start': 'changeWeek'

  changeWeek: (event) ->
    console.log 'hello'

module.exports = general