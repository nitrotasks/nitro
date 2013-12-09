Base = require 'base'
keys = require '../utils/keys'
Views = require '../controllers/views'

class Keys extends Base.View

  el: $ document

  events:
    'keyup': 'keyup'
    'blur .editable, input': 'blur'
    'focus .editable, input': 'focus'

  constructor: ->
    super

    @input  = null
    @focused = false

  focus: (e) =>
    @input = $(e.target)
    @focused = true

  blur: =>
    @focused = false

  keyup: (event)  =>

    keyCode = event.keyCode

    if @focused
      if keyCode is keys.escape
        @input.blur()
      return true

    @handleKeyCode keyCode

  handleKeyCode: (keyCode) =>

    switch keyCode

      when keys.escape

        # Escape
        # - hide modals
        # - collapse tasks

        if Views.modal.displayed
          Views.modal.current.hide()

        else
          Views.tasks.collapse()

      when keys.n

        # New Task
        # - focus the task input box

        Views.tasks.focus()

      when keys.l

        # New List
        # - focus the list input box

        Views.lists.focus()

      when keys.f

        # Search
        # - open the all tasks list
        # - and focus the task input box

        Views.list.all.open()
        Views.tasks.focus()

      when keys.p

        # Print
        # - print the current page

        Views.listMenu.print()

      when keys.comma

        # Settings
        # - show the settings modal

        Views.settings.show()

      when keys.k

        # Go to the previous list
        # - load the previous list

        Views.lists.prev()

      when keys.j

        # Go to the next list
        # - load the next list

        Views.lists.next()

module.exports = Keys
