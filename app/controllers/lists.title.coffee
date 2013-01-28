Spine = require('spine')
List  = require("models/list")
Setting = require("models/setting")
Keys  = require("utils/keys")

class ListTitle extends Spine.Controller

  elements:
    "h1": "listName"
    ".buttons .trash": "deleteButton"
    ".buttons .sort": "sortButton"

  events:
    "keyup h1": "rename"
    "keypress h1": "preventer"
    "click .buttons a": "menuClick"
    "touchend .buttons a": "menuClick"

  constructor: ->
    super
    List.bind "changeList", @render

  # Display listname
  render: (@list) =>
    @listName.text @list.name

    # Disables contenteditable on noneditable lists
    if @list.permanent
      @listName.removeAttr("contenteditable")
      @deleteButton.fadeOut(150)
    else
      @listName.attr("contenteditable", true)
      @deleteButton.fadeIn(150)

    # Er, not sure but it detects complted and all
    if @list.disabled
      @sortButton.fadeOut(150)
    else
      @sortButton.fadeIn(150)

  # This is fired on keyup when a list is renamed
  rename: (e) ->
    List.current.updateAttribute("name", @listName.text())

  # Prevents the enter key
  preventer: (e) ->
    e.preventDefault() if e.which is Keys.ENTER

  # Handles menu buttons
  menuClick: (e)->

    switch e.currentTarget.className
      when "trash"
        if Setting.get "confirmDelete"
          $(".modal.delete").modal "show"

          $(".modal.delete .true").on "click touchend", =>
            @list.trigger "kill"
            $(".modal.delete").modal "hide"
            $(".modal.delete .true").off "click touchend"

          $(".modal.delete .false").on "click touchend", (e) ->
            $(".modal.delete").modal "hide"
            $(".modal.delete .false").off "click touchend"

        else
          @list.trigger "kill"

      when "email" then $(".modal.email").modal()
      when "print" then window.print()
      when "share" then $(".modal.share").modal()
      when "sort"  then Setting.toggleSort()

module.exports = ListTitle
