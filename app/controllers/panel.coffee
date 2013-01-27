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
    "click .user": "toggleAccount"
    "click .settingsButton img": "toggleSettings"

  constructor: ->
    Setting.bind "login", @personal
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

  personal: =>
    $(".user img").attr("src", "http://www.gravatar.com/avatar/" + md5(Setting.get("user_email").toLowerCase()))
    $(".user .name").text(Setting.get("user_name"))

  clearSearch: =>
    @searchInput.val("").focus()
    List.trigger "changeList", @originalList

  toggleAccount: ->
    $(".settings-container li")[1].click()
    Setting.trigger "show"

  toggleSettings: ->
    $(".settings-container li")[0].click()
    Setting.trigger "show"

module.exports = Panel
