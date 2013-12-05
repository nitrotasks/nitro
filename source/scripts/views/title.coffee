Base = require 'base'
List = require '../models/list'
keys = require '../utils/keys'
delay = require '../utils/timer'

class Title extends Base.View

  elements:
    '.list-name': 'title'

  events:
    'keyup h1': 'rename'
    'keypress h1': 'preventer'

  constructor: ->
    Base.touchify(@events)
    super

    @bind $ '.tasks .title'

    @listen List,
      'select:model': @render

  # Display listname
  render: (@list) =>

    delay 150, =>
      @title.val @list.name

      if @list.permanent
        @title.prop 'disabled', true
      else
        @title.prop 'disabled', false

  # This is fired on keyup when a list is renamed
  rename: (e) =>
    @list.name = @title.text()

  # Prevents the enter key
  preventer: (e) ->
    if e.keyCode is keys.enter
      e.preventDefault()

module.exports = Title
