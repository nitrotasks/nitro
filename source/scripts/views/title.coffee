Base = require 'base'
List = require '../models/list'
keys = require '../utils/keys'

class Title extends Base.Controller

  elements:
    'h1': 'title'

  events:
    'keyup h1': 'rename'
    'keypress h1': 'preventer'

  constructor: ->
    Base.touchify(@events)
    super

    @el = $('.tasks .title')
    @bind()

    @listen List,
      'select:model': @render

  # Display listname
  render: (@list) =>
    @title.text @list.name
    
    if @list.permanent
      @title.removeAttr 'contenteditable'
    else
      @title.attr 'contenteditable', true

  # This is fired on keyup when a list is renamed
  rename: (e) =>
    @list.name = @title.text()

  # Prevents the enter key
  preventer: (e) ->
    if e.keyCode is keys.enter
      e.preventDefault()

module.exports = Title