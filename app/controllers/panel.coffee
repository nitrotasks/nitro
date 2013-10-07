# Base
Base = require 'base'

# Controllers
Settings = require './settings.coffee'

# Models
List     = require '../models/list.coffee'
Task     = require '../models/task.coffee'
setting  = require '../models/setting.coffee'


class Panel extends Base.Controller

  elements:
    '.user img': 'avatar'
    '.user .name': 'name'
    '.search input': 'searchInput'
    '.search a': 'clearSearchButton'
    '.sidebar': 'sidebar'

  events:
    'click .logo': 'toggleMenu'
    'keyup .search input': 'search'
    'click .search a': 'clearSearch'
    'click .user': 'toggleAccount'
    'click .settingsButton .img': 'toggleSettings'

  constructor: ->
    # Spine.touchify(@events)
    super

    setting.on 'change:userName',   @setName
    setting.on 'change:userEmail',  @setAvatar
    setting.on 'offline',           @offline

    setting.on 'login', =>
      @setName()
      @setAvatar()

  toggleMenu: (onOff) =>
    @sidebar.toggleClass('show', onOff)

  search: =>
    if List.current.id isnt 'filter'
      @originalList = List.current
    query = @searchInput.val()
    if query.length is 0
      @clearSearch()
    else
      List.trigger 'change:current',
        name: "Results for: #{ query }"
        id: 'filter'
        tasks: Task.search(query)
        disabled: yes
        permanent: yes

  setName: (name = setting.userName) =>
    @name.text(name)

  setAvatar: =>
    email = setting.userEmail.toLowerCase()
    id = md5(email)
    link = "http://www.gravatar.com/avatar/#{ id }"
    @avatar.show().attr('src', link)

  offline: =>
    return unless not setting.noAccount
    name = setting.userName
    console.log 'Name', name
    @setName("#{ name } - Offline")

  clearSearch: =>
    # @searchInput.val('').focus()
    List.trigger 'change:current', @originalList

  toggleAccount: ->
    $('.settings-container li')[1].click()
    setting.trigger 'show'

  toggleSettings: ->
    $('.settings-container li')[0].click()
    setting.trigger 'show'

module.exports = Panel
