Base     = require 'base'
List     = require '../models/list'
keys     = require '../utils/keys'
ListItem = require '../views/list/item'

class Lists extends Base.Controller

  elements:
    'ul': 'lists'
    '.create-list': 'input'

  events:
    'keyup .create-list': 'keyup'

  constructor: ->
    Base.touchify(@events)
    super

    @el = $('.sidebar')
    @bind()

    @listen List,
      'create:model': @addOne
      'refresh':      @addAll
      'select:model': @select

  keyup: (e) =>
    if e.which is keys.enter and @input.val().length
      @createNew()

  # Create a new list
  createNew: =>
    name = @input.val()
    @input.val ''
    list = List.create name: name
    list.trigger 'select'

  # Add a single list to the DOM
  addOne: (list) =>
    return if list.id is 'inbox'
    listItem = new ListItem
      list: list
    @lists.append listItem.render().el

  # Draw all lists to the DOM
  addAll: =>
    @lists.empty()
    List.forEach @addOne

  select: =>
    @lists
      .find('.current')
      .removeClass('current')

module.exports = Lists
