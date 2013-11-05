keys = require '../utils/keys'
Base = require 'base'

class Keys extends Base.View

  events:
    'keyup': 'keyup'
    'blur .editable, input': 'blur'
    'focus .editable, input': 'focus'

  constructor: ->
    super

    @el = $('body')
    @bind()

    @input  = null
    @focused = false

  focus: (e) =>
    @input = $(e.target)
    @focused = true

  blur: =>
    @focused = false

  keyup: (e)  =>
    keyCode = e.keyCode

    # If an input is focused
    if @focused
      if keyCode is keys.escape then @input.blur()
      return true

    switch keyCode
      when keys.escape
        @tasks.collapseAll()

      # TODO: Refactor using Modules and Classes instead of modifying the DOM directly

      when keys.n
        # New Task
        $(".new-task").focus().val("")

      when keys.l
        # New List
        $(".new-list").focus().val("")

      when keys.f
        # Search
        $(".search input").focus().val("")

      when keys.p
        # Print
        $(".buttons .print").trigger("click")

      when keys.comma
        # Settings
        $(".settingsButton img").trigger("click")

      when keys.k
        # Go to the prev list
        if $(".sidebar .current").prev().length is 0
          # Go to completed
          $(".sidebar .completed").trigger("click")
        else
          $(".sidebar .current").prev().trigger("click")
          # Cancel the Focus if shortcut is used
          $(".new-task").blur()

      when keys.j
        # Go to the next list
        if $(".sidebar .current").next().hasClass("lists")
          # Go to first list
          $($(".sidebar .lists").children()[0]).trigger("click")
          $(".new-task").blur()
        else
          $(".sidebar .current").next().trigger("click")
          $(".new-task").blur()


module.exports = Keys
