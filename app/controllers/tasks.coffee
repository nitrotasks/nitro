# Base
Base        = require 'base'

# Controllers
TaskItem     = require './tasks.item.coffee'

# Models
Task         = require '../models/task.coffee'
List         = require '../models/list.coffee'
Setting      = require '../models/setting.coffee'

# Utils
Keys         = require '../utils/keys.coffee'
dateDetector = require '../utils/date.coffee'


class Tasks extends Base.Controller

  template: require '../views/task'

  elements:
    'ul.tasks': 'tasks'
    'input.new-task': 'input'

  events:
    'scroll': 'scrollbars'
    'keydown input.new-task': 'createNew'
    'click': 'collapseAllOnClick'

  # Store currently loaded tasks
  items: []
  timers: {}

  constructor: ->
    Base.touchify(@events)
    super

    @listen [
      Task,
        'create:model': @addOne
        'refresh': @reload
      List,
        'change:current': @render
      Setting,
        'change:sort': @render
    ]

    # TODO: Refactor this
    $('body').on 'mouseover', '.main .task', ->

      if Setting.sort and
      not $(this).hasClass('ui-draggable') and
      not List.current.disabled

        $(this).draggable
          distance: 10
          scroll: false
          cursorAt:
            top: 15
            left: 30
          helper: (event, task) ->
            id = $(task).attr('id')
            element = "<div data-id=\'#{ id }\' class=\'helper\'>#{ $(this).find('.name').text() }</div>"
            $('body').append(element)
            $("[data-id=#{ id }]")

    # TODO: Refactor this
    self = this
    $(this.el[1]).sortable
      distance: 10
      scroll: false
      cursorAt:
        top: 15
        left: 30
      helper: (event, task) ->
        id = $(task).attr('id')
        element = "<div data-id=\'#{ id }\' class=\'helper\'>#{ $(task).find('.name').text() }</div>"
        $('body').append(element)
        $("[data-id=#{ id }]")
      update: ( event, ui ) ->
        arr = []
        $(this).children().each (index) ->
          arr.unshift $(this).attr('id').slice(5)
        self.list.updateAttribute('tasks', arr)

  # Add a single task to the DOM
  addOne: (task) =>
    return unless List.current.id in [task.list, 'all']

    # Translations
    # TODO: Only do this once, maybe mix it into the template?
    task.notesplaceholder = $.i18n._ 'Notes'
    task.dateplaceholder  = $.i18n._ 'Due Date'
    task.checkboxalttext  = $.i18n._ 'Mark as completed'
    task.lowalttext       = $.i18n._ 'Set priority to low'
    task.mediumalttext    = $.i18n._ 'Set priority to medium'
    task.highalttext      = $.i18n._ 'Set priority to high'
    task.dateValue = Task.prettyDate(new Date(task.date)).words
    task.dateClass = Task.prettyDate(new Date(task.date)).className

    # Add task to DOM
    @tasks.prepend @template task

    # Create a new controller
    view = new TaskItem
      el: @tasks.find '#task-' + task.id
      task: task

    # TODO: Can we do this in the template?
    view.el.addClass 'new'

    @items.push view

    @el.removeClass 'empty'

  # Render the current list
  reload: =>
    @render List.current if List.current

  # Display a list of tasks
  render: (list) =>

    # TODO: What are the timers for again?
    if @timers.bindTasks? then clearTimeout @timers.bindTasks

    # TODO: Move this somewhere else
    @el.removeClass 'empty'

    # Update current list if the list is changed
    # hackery hack for completed & all. fuckit, we're shipping
    if list instanceof List.model or list.id is 'all' or list.id is 'completed'
      @list = list

    # Something to do with sorting tasks
    if @list.disabled
        $(@el[1]).sortable({ disabled: true })
    else
      if not Setting.sort
        $(@el[1]).sortable({ disabled: false })

    # Disable task input box
    if @list.disabled
      @input.hide()
    else
      @input.show()

    # TODO: Do we really need this?
    oldItems = @items.slice(0)
    @items = []

    # Unbind existing tasks
    # TODO: Can we use nextAnimationFrame for this?
    setTimeout ->
      for item in oldItems
        item.release()
    , 100

    html = ''

    # TODO: Why? At the very least, cache it in elements
    @el.find('.message').remove()

    # TODO: Move HTML into a view

    # Special list
    if @list.id is 'filter'
      tasks = @list.tasks
      @el.append '<div class="message">' + $.i18n._('No tasks could be found.') + '</div>'

    # Standard list
    else if @list?.tasks
      tasks = @list.tasks
      @el.append  '<div class="message">' + $.i18n._('You haven\'t added any tasks to this list.') + '</div>'

    # Empty list
    else
      tasks = Task.list(@list.id)
      @el.append  '<div class="message">' + $.i18n._('There are no tasks in here.') + '</div>'

    # Sorting tasks
    if list.id in ['all', 'completed'] or Setting.sort

      tasks = Task.sortTasks(tasks)
      last = tasks[0]?.priority
      completed = tasks[0]?.completed

      for task in tasks

        # Add seperator if it is completed and the last one wasn't
        if completed and not task.completed
          completed = false
          task.group = yes

        # Add seperator if it is a different priority to the last one
        if not completed and task.priority isnt last
          task.group = yes

        last = task.priority

        # Translations
        # TODO: Only do this once, in a seperate file
        task.notesplaceholder = $.i18n._ 'Notes'
        task.dateplaceholder  = $.i18n._ 'Due Date'
        task.checkboxalttext  = $.i18n._ 'Mark as completed'
        task.lowalttext       = $.i18n._ 'Set priority to low'
        task.mediumalttext    = $.i18n._ 'Set priority to medium'
        task.highalttext      = $.i18n._ 'Set priority to high'

        task.dateValue = Task.prettyDate(new Date(task.date)).words
        task.dateClass = Task.prettyDate(new Date(task.date)).className

        if list.id is 'all'
          task.listName = List.get(task.list).name

        # Append html
        html = @template(task) + html

    # Not sorting
    else

      for task in tasks

        # TODO: Only do this once, in a seperate file
        task.notesplaceholder = $.i18n._ 'Notes'
        task.dateplaceholder  = $.i18n._ 'Due Date'
        task.checkboxalttext  = $.i18n._ 'Mark as completed'
        task.lowalttext       = $.i18n._ 'Set priority to low'
        task.mediumalttext    = $.i18n._ 'Set priority to medium'
        task.highalttext      = $.i18n._ 'Set priority to high'

        task.dateValue = Task.prettyDate(new Date(task.date)).words
        task.dateClass = Task.prettyDate(new Date(task.date)).className

        if list.id is 'all'
          task.listName = List.get(task.list).name

        html = @template(task) + html

    @tasks.addClass('loading')
    @tasks[0].innerHTML = ''

    setTimeout =>
      @tasks[0].innerHTML = html
      @tasks.removeClass('loading')
    , 150

    @timers.bindTasks = setTimeout =>
      for task in tasks
        view = new TaskItem
          task: task
          el: @tasks.find("#task-#{ task.id }")
        @items[@items.length] = view
    , 400

    # Handles Empty List
    if tasks.length is 0
      @el.addClass 'empty'

    # Focuses input if not on a touchscreen (virtual keyboard)
    # TODO: Don't make is_touch_device a global
    @input.focus() if !is_touch_device()

  # Create a new task
  createNew: (e) =>

    val = @input.val()

    if e.which is Keys.ENTER and val

      # TODO: What is this?
      if Setting.sort
        if $('.main .tasks .seperator').length == 0
          $('.main .tasks').prepend('<li class="seperator"></li>')

      task = Task.create
        name: val
        list: @list?.id
        date: dateDetector.parse(val)

      # Add to current list
      List.current.tasks.add task

      # Clear input
      @input.val ''

  # ------------
  # COLLAPSE ALL
  # ------------

  collapseAll: ->
    if !List.current.disabled
      if Setting.sort
        @el.find('.expanded').draggable({ disabled: false })
      else
        @el.find('.expanded').parent().sortable({ disabled: false })

    @el.find('.expanded')
      .removeClass('expanded')
      .find('.name')
      .blur()
      .attr('contenteditable', false)
      .parent()
      .find('.notes')
      .removeClass('auto')

  # Collapsing of tasks
  collapseAllOnClick: (e) =>
    # Only works on some elements
    # if e.target.nodeName in ['SECTION', 'INPUT', 'H1', 'A'] or $(e.target).hasClass('title') or $(e.target).hasClass('tasks-container')
    if e.target.className is 'main tasks'
      @collapseAll()

  scrollbars: (e) =>
    target = $(e.currentTarget)
    target.addClass('show')

    clearTimeout(@scrollbarTimeout)
    @scrollbarTimeout = setTimeout ->
      target.removeClass('show')
    , 1000


module.exports = Tasks
