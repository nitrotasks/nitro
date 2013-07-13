# Spine
Spine   = require 'spine'

# Controllers
Modal   = require './modal.coffee'

# Models
List    = require '../models/list.coffee'
Setting = require '../models/setting.coffee'

# Utils
Keys    = require '../utils/keys.coffee'


class ListTitle extends Spine.Controller

  elements:
    "h1": "listName"
    ".buttons .trash": "deleteButton"
    ".buttons .sort": "sortButton"

  events:
    "keyup h1": "rename"
    "keypress h1": "preventer"
    "click .buttons a": "menuClick"

  constructor: ->
    Spine.touchify(@events)
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
      when "trash" then Modal.get("trashList").run()
      when "email" then Modal.get("email").show()
      when "print" then window.print()
      when "share" then Modal.get("share").show()
      when "sort"  then Setting.toggle('sort')

module.exports = ListTitle
