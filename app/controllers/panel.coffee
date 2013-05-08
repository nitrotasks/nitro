Spine = require('spine')
List = require("models/list")
Task = require("models/task")
Setting = require("models/setting")
Settings = require("controllers/settings")

class Panel extends Spine.Controller

  elements:
    '.user img': 'avatar'
    '.user .name': 'name'
    ".search input": "searchInput"
    ".search a": "clearSearchButton"

  events:
    "click .logo": "showMenu"
    "keyup .search input": "search"
    "click .search a": "clearSearch"
    "click .user": "toggleAccount"
    "click .settingsButton .img": "toggleSettings"

  constructor: ->
    Spine.touchify(@events)
    super

    Setting.bind 'update:user_name', @setName
    Setting.bind 'update:user_email', @setAvatar

    Setting.bind "login", =>
      @setName()
      @setAvatar()

  showMenu: =>
    $(".sidebar").toggleClass("show")

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

  setName: =>
    name = Setting.get('user_name')
    @name.text(name)

  setAvatar: =>
    email = Setting.get('user_email').toLowerCase()
    id = md5(email)
    link = "http://www.gravatar.com/avatar/#{ id }"
    @avatar.show().attr('src', link)

  clearSearch: =>
    # @searchInput.val("").focus()
    List.trigger "changeList", @originalList

  toggleAccount: ->
    $(".settings-container li")[1].click()
    Setting.trigger "show"

  toggleSettings: ->
    $(".settings-container li")[0].click()
    Setting.trigger "show"

module.exports = Panel
