Base = require 'base'
List = require '../models/list'
keys = require '../utils/keys'
delay = require '../utils/timer'

class Title extends Base.View

  el: '.tasks .title'

  ui:
    title: '.list-name'

  events:
    'input .list-name': 'rename'

  constructor: ->
    super

    @listen List,
      'select:model': @render

  # Display listname
  render: (@list) =>

    delay 150, =>
      @ui.title.val @list.name

      if @list.permanent
        @ui.title.prop 'disabled', true
      else
        @ui.title.prop 'disabled', false

  # This is fired on keyup when a list is renamed
  rename: (e) =>
    @list.name = @ui.title.val()

module.exports = Title
