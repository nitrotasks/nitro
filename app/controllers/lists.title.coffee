Spine = require('spine')
List  = require("models/list")
Keys  = require("utils/keys")

class ListTitle extends Spine.Controller

  elements:
    "h1": "listName"
    ".buttons .trash": "deleteButton"

  events:
    "keyup h1": "rename"
    "keypress h1": "preventer"
    "click .buttons a": "menuClick"

  constructor: ->
    super
    List.bind "changeList", @render

  # Display listname
  render: (@list) =>
    @listName.text @list.name

    # Disables contenteditable on noneditable lists
    if @list.permanent
      @listName.removeAttr("contenteditable")
      @deleteButton.fadeOut(300)
    else
      @listName.attr("contenteditable", true)
      @deleteButton.fadeIn(300)

  # This is fired on keyup when a list is renamed
  rename: (e) ->
    List.current.updateAttribute("name", @listName.text())

  # Prevents the enter key
  preventer: (e) ->
    e.preventDefault() if e.which is Keys.ENTER

  # Handles menu buttons
  menuClick: (e)->
    if $(e.currentTarget).hasClass("trash")
      @list.destroy()
    else if $(e.currentTarget).hasClass("email")
      console.log("emailing")

    # Prints Tasks
    else if $(e.currentTarget).hasClass("print")
      window.print()
    else if $(e.currentTarget).hasClass("share")
      console.log("sharing")

module.exports = ListTitle
