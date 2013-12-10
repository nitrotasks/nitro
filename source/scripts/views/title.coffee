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
    'keydown .list-name': 'preventEnter'

  constructor: ->
    super

    @listen List,
      'select:model': @render

  # Display listname
  render: (@list) =>

    delay 150, =>
      @ui.title.text @list.name
      @ui.title.attr 'contenteditable', not @list.permanent

  # This is fired on keyup when a list is renamed
  rename: (e) =>
    @list.name = @ui.title.text()

  preventEnter: (e) =>
    if e.keyCode is keys.enter
      e.preventDefault()
      return false

module.exports = Title
