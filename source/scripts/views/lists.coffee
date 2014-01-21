Base     = require 'base'
List     = require '../models/list'
keys     = require '../utils/keys'
ListItem = require '../views/list/item'
Mouse    = require '../utils/mouse'
event    = require '../utils/event'
Inbox    = require '../views/list/inbox'

class Lists extends Base.View

  # Reference the currently open list
  @active: null

  el: '.sidebar'

  ui:
    lists: 'ul'
    input: '.create-list'

  events:
    'keyup .create-list': 'keyup'

  constructor: ->
    super

    # Store views so we can release them later
    @views = []

    # Listen to the List collection
    @listen List,
      'create:model': @addOne
      'refresh':      @addAll
      'select:model': @select

  # Handle input keyboard events
  # - e (Event) : the keyup event
  keyup: (e) =>
    if e.which is keys.enter and @ui.input.val().length
      @createNew @ui.input.val()
      @ui.input.blur().val ''

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
    @views.push listItem
    @ui.lists.append listItem.render().el

  # Render the inbox
  addInbox: =>
    inbox = List.get 'inbox'
    view = new Inbox list: inbox
    @views.push view

  # Render all lists
  addAll: =>
    view.remove() for view in @views
    @views = []
    @addInbox()
    List.forEach @addOne

  # Select a list
  # - list (List) : the list to select
  select: (list) =>
    Lists.active = list

    # Clear the currently selected tasks
    Mouse.tasks.clearSelection()

    # Clear the currently selected list
    @el.find('.active').removeClass('active')

  # Focus the list input
  focus: =>
    @ui.input.focus()

  # Select the next list
  next: =>

    id = Lists.active.id

    if id is 'inbox'
      event.trigger 'list:all'

    else if id is 'search'
      if Lists.active.type is 'active'
        event.trigger 'list:completed'
      else
        List.at(1).trigger 'select'

    else
      index = List.indexOf id
      list = List.at(index + 1)
      if list? then list.trigger 'select'

  # Select the previous list
  prev: =>

    id = Lists.active.id

    if id is 'inbox'
      return

    else if id is 'search'
      if Lists.active.type is 'active'
        List.get('inbox').trigger 'select'
      else
        event.trigger 'list:all'

    else
      index = List.indexOf id
      if index is 1
        event.trigger 'list:completed'
      else
        list = List.at(index - 1)
        list.trigger 'select'

module.exports = Lists
