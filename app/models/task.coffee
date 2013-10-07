Base = require 'base'
Sync = require '../controllers/sync'

class Task extends Base.Model

  defaults:
    name: ''
    date: null
    notes: ''
    completed: false
    priority: 1
    list: null

  @extend Sync.core

class TaskCollection extends Base.Collection

  model: Task

  # Get the active tasks
  # - [list] (string) : The list ID. If specified, will only return tasks in that list.
  active: (list) =>
    @filter (task) ->
      !task.completed and (if list then (task.list is list) else yes)

  # Get the completed tasks
  completed: =>
    @filter (task) -> task.completed

  # Get the matching tasks for a list
  list: (listId) =>
    return [] unless listId
    if listId is 'all' then return @active()
    else if listId is 'completed' then return @completed()
    @filter (task) -> task.list is listId

  # TODO: Move this somewhere else
  default: ->
    if Task.length is 0
      require('../models/list').refresh require '../misc/default_lists.json'
      @refresh require '../misc/default_tasks.json'

  #
  sortTasks: (tasks) =>
    sorted = tasks.sort (a, b) ->
      # If logged, move to bottom
      if a.completed is b.completed
        diff = a.priority - b.priority
        if diff is 0
          # If the priorities are the same then sort by date, then by name
          newA = if a.date is false or a.date is '' then Infinity else a.date
          newB = if b.date is false or b.date is '' then Infinity else b.date

          diff = newB - newA

          # Infinity - Infinity is NaN
          if isNaN(diff)
            b.name.localeCompare(a.name)
          else diff
        else diff
      else if a.completed and not b.completed then -1
      else if not a.completed and b.completed then 1
      else a.completed - b.completed

  # Search through tasks
  search: (query) =>
    return @all unless query
    query = query.toLowerCase().split(' ')
    @filter (item) ->
      matches = yes
      for word in query
        if not item.name?.toLowerCase().match(word) then matches = no
      return matches

  # TODO: This should be put in a seperate file
  prettyDate: (date) ->
    # This needs to be translated properly
    month = [
      $.i18n._ 'Jan'
      $.i18n._ 'Feb'
      $.i18n._ 'Mar'
      $.i18n._ 'Apr'
      $.i18n._ 'May'
      $.i18n._ 'Jun'
      $.i18n._ 'Jul'
      $.i18n._ 'Aug'
      $.i18n._ 'Sep'
      $.i18n._ 'Oct'
      $.i18n._ 'Nov'
      $.i18n._ 'Dec'
    ]

    # Create Date
    now = new Date()
    difference = 0
    oneDay = 86400000; # 1000*60*60*24 - one day in milliseconds

    # Find difference between days
    difference = Math.ceil((date.getTime() - now.getTime()) / oneDay)

    words = ''
    className = ''

    ###

      Difference
      ==  5: '5 days left'
      ==  1: 'Due tomorrow'
      ==  0: 'Due today'
      == -1: 'Due yesterday'
      == -5: '5 days overdue'

    ###

    # Show difference nicely
    if difference is -1
      # Yesterday
      words = $.i18n._ 'yesterday'
      className = 'overdue'

    else if difference < -1
      # Overdue

      # Make sure the difference is a positive number
      difference = Math.abs difference
      words = difference + ' ' + $.i18n._ 'days ago'
      className = 'overdue'

    else if difference is 0
      # Due Today
      words = $.i18n._ 'today'
      className = 'due'

    else if difference is 1
      # Due Tomorrow
      words = $.i18n._ 'tomorrow'
      className = 'soon'

    else if difference < 15
      # Due in the next 15 days
      words = 'in ' + difference + ' days'

    else
      words = month[date.getMonth()] + ' ' + date.getDate()

    {
      words: words
      className: className
    }

  # Find tasks with matching tags
  tag: (tag) =>
    return [] unless tag
    tag = tag.toLowerCase()
    @filter (item) ->
      item.name?.toLowerCase().indexOf('#'+tag) > -1

module.exports = new TaskCollection()
