Spine = require('spine')
List  = require("models/list")

class ListTitle extends Spine.Controller

  elements:
    "h1": "listName"

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
    if @list.id is "all" or @list.id is "inbox"
      @listName.removeAttr("contenteditable")
    else
      @listName.attr("contenteditable", true)

  # This is fired on keyup when a list is renamed
  rename: (e) ->
    List.current.updateAttribute("name", @listName.text())

  # Prevents the enter key
  preventer: (e) ->
    e.preventDefault() if e.keyCode is 13

  # Prints JELLO
  menuClick: ->
    console.log("JELLO")

module.exports = ListTitle
