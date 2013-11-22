ListItem = require './item'
event = require '../../utils/event'

class ListSearch extends ListItem

  constructor: ->
    super
    @bind $ '.search.list'

  click: =>
    event.trigger 'search'
    @select()

module.exports = ListSearch