Spine = require('spine')
List = require("models/list")
Task = require("models/task")

class Panel extends Spine.Controller

  elements:
    ".search input": "searchInput"
    ".search a": "clearSearchButton"

  events:
    "keyup .search input": "search"
    "click .search a": "clearSearch"

  constructor: ->
    super

  search: =>
    if List.current.id isnt "search"
      @originalList = List.current
    query = @searchInput.val()
    if query.length is 0
      @clearSearch()
    else
      List.trigger "changeList",
        name: "Results for: #{ query }"
        id: "search"
        tasks: Task.filter(query)
        disabled: yes
        permanent: yes

  clearSearch: =>
    @searchInput.val("").focus()
    List.trigger "changeList", @originalList

module.exports = Panel
