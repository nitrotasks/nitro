Spine = require('spine')
List = require("models/list")
Task = require("models/task")
Setting = require("models/setting")
Settings = require("controllers/settings")

class Panel extends Spine.Controller

  elements:
    ".search input": "searchInput"
    ".search a": "clearSearchButton"

  events:
    "keyup .search input": "search"
    "click .search a": "clearSearch"
    "click .user": "toggleSettings"

  constructor: ->
    super

  search: =>
    if List.current.id isnt "filter"
      @originalList = List.current
    query = @searchInput.val()
    if query.length is 0
      @clearSearch()
    else
      List.trigger "changeList",
        name: "Results for: #{ query }"
        id: "filter"
        tasks: Task.filter(query)
        disabled: yes
        permanent: yes

  clearSearch: =>
    @searchInput.val("").focus()
    List.trigger "changeList", @originalList

  toggleSettings: ->
    Setting.trigger "show"

module.exports = Panel
