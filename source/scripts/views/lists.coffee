Base     = require 'base'
List     = require '../models/list'
keys     = require '../utils/keys'
ListItem = require '../views/list/item'

class Lists extends Base.View
  
  # Reference the currently open list
  @active: null

  # UI elements
  elements:
    'ul': 'lists'
    '.create-list': 'input'
  
  # UI events
  events:
    'keyup .create-list': 'keyup'

  constructor: ->
    super
    
    # Bind to sidebar
    @bind $ '.sidebar' 
    
    # Listen to the List collection
    @listen List,
      'create:model': @addOne
      'refresh':      @addAll
      'select:model': @select
  
  # Handle input keyboard events
  # - e (Event) : the keyup event
  keyup: (e) =>
    if e.which is keys.enter and @input.val().length
      @createNew @input.val()
      @input.val ''

  # Create a new list
  # - name (string) : the name of the list
  createNew: (name) =>
    list = List.create name: name
    list.trigger 'select'

  # Render a single list
  # - list (List) : the list to render
  addOne: (list) =>
    return if list.id is 'inbox'
    listItem = new ListItem list: list
    @lists.append listItem.render().el

  # Render all lists
  addAll: =>
    @lists.empty()
    List.forEach @addOne
  
  # Select a list
  # - list (List) : the list to select
  select: (list) =>
    Lists.active = list
    # Clear the currently selected list
    @lists
      .find('.current')
      .removeClass('current')

module.exports = Lists
