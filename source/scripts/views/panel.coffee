# Base
Base     = require 'base'

# Controllers
Settings = require '../controllers/settings'

# Models
List     = require '../models/list'
Task     = require '../models/task'
Setting  = require '../models/setting'
Event    = require '../utils/event'

class Panel extends Base.View

  elements:
    avatar: '.user img'
    name: '.user .name'
    sidebar: '.sidebar'

  events: Base.touchify
    'click .logo':          'toggleMenu'
    'click .user':          'toggleAccount'
    'click .openSettings':  'openSettings'

  constructor: ->
    super

    @listen Setting,
      'change:userName':   @setName
      'change:userEmail':  @setAvatar
      'offline':           @offline
      'login': =>
        @setName()
        @setAvatar()

  toggleMenu: (onOff) =>
    @ui.sidebar.toggleClass('show', onOff)

  setName: (name = setting.userName) =>
    @ui.name.text(name)

  setAvatar: =>
    email = Setting.userEmail.toLowerCase()
    id = md5(email)
    link = "http://www.gravatar.com/avatar/#{ id }"
    @ui.avatar.show().attr('src', link)

  offline: =>
    return unless not Setting.noAccount
    name = Setting.userName
    @setName("#{ name } - Offline")

  toggleAccount: ->
    Event.trigger 'settings:show'

  openSettings: ->
    Event.trigger 'settings:show'

module.exports = Panel
