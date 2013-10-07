# Base
Base    = require 'base'
$       = require 'jqueryify'

# Controllers
ListItem = require './lists.item.coffee'

# Models
List     = require '../models/list.coffee'
Task     = require '../models/task.coffee'

# Utils
Keys     = require '../utils/keys.coffee'


class Lists extends Base.Controller

  elements:
    'ul': 'lists'
    'input': 'input'
    '.list.all': 'all'
    '.list.inbox': 'inbox'
    '.list.completed': 'completed'
    '.list.all .count': 'allCount'
    '.list.inbox .count': 'inboxCount'
    '.list.completed .count': 'completedCount'

  events:
    'keyup input': 'new'
    'click .title img': 'searchToggle'
    'click .list.all': 'showAllTasks'
    'click .list.inbox': 'showInbox'
    'click .list.completed': 'showCompleted'

  constructor: ->
    Base.touchify(@events)
    super
    @listen List,
      'create':         @addOne
      'destroy':        @showInbox
      'refresh':        @addAll
      'change:current': @change
      'refresh change': @updateAll

    # Set up draggable on inbox
    @inbox.droppable
      hoverClass: 'ui-state-active'
      tolerance: 'pointer'
      drop: (event, ui) =>
        movedTask = Task.get(ui.draggable.attr('id').slice(5))
        List.current.moveTask(movedTask, List.get('inbox'))

  searchToggle: (e) ->
    $('.sidebar .searchToggle, .sidebar .normal').toggleClass('hide')

    if $('.sidebar .normal').hasClass('hide')
      $('.sidebar .title input').val('').focus()
    else
      $('header .search input').val('').trigger 'keyup'

  new: (e) ->

    # Handles correct box
    if $(e.currentTarget).hasClass('searcher')
      $('header .search input').val($(e.currentTarget).val()).trigger 'keyup'

      # Overides the other function thingy
      if val.length is 0
        $(e.currentTarget).focus()
    else
      if e.which is Keys.ENTER and $(e.currentTarget).val()
        list = List.create name: $(e.currentTarget).val()
        List.trigger 'change:current', list
        $(e.currentTarget).val ''

  addOne: (list) =>
    return if list.id is 'inbox'
    listItem = new ListItem( list: list )
    @lists.append listItem.render().el

  addAll: =>
    @lists.empty()
    List.forEach(@addOne)

  change: (list) =>
    $('.sidebar').removeClass('show')
    List.current = list

  # Show all tasks
  showAllTasks: =>
    List.trigger 'change:current',
      name: $.i18n._('All Tasks')
      id: 'all'
      disabled: yes
      permanent: yes
    @el.find('.current').removeClass 'current'
    @all.addClass 'current'
    return

  # Show inbox
  showInbox: =>
    List.trigger 'change:current', List.get('inbox')
    @el.find('.current').removeClass 'current'
    @inbox.addClass 'current'
    return

  # Show completed
  showCompleted: =>
    List.trigger 'change:current',
      name: $.i18n._('Completed')
      id: 'completed'
      permanent: yes
      disabled: yes
    @el.find('.current').removeClass 'current'
    @completed.addClass 'current'
    return

  updateAll: =>
    @inboxCount.text Task.active('inbox').length
    @allCount.text Task.active().length
    @completedCount.text Task.completed().length

    # Updates Counts for all other lists
    List.forEach (list) ->
      list.trigger('update:tasks')

module.exports = Lists
