# Base
Base     = require 'base'

# Controllers
Settings = require '../controllers/settings'
Search   = require '../controllers/search'

# Models
List     = require '../models/list'
Task     = require '../models/task'
Setting  = require '../models/setting'
Event    = require '../utils/event'

class Panel extends Base.Controller

  elements:
    '.search':      'search'
    '.user img':    'avatar'
    '.user .name':  'name'
    '.sidebar':     'sidebar'

  events:
    'click .logo':          'toggleMenu'
    'click .user':          'toggleAccount'
    'click .openSettings':  'openSettings'

  constructor: ->
    Base.touchify(@events)
    super

    # Create a search box
    new Search
      el: @search

    @listen [
      Setting,
        'change:userName': @setName
        'change:userEmail': @setAvatar
      Event,
        'app:offline': @offline
        'app:login': =>
          @setName()
          @setAvatar()
    ]

  toggleMenu: (onOff) =>
    @sidebar.toggleClass('show', onOff)
 
  setName: (name = setting.userName) =>
    @name.text(name)

  setAvatar: =>
    email = Setting.userEmail.toLowerCase()
    id = md5(email)
    link = "http://www.gravatar.com/avatar/#{ id }"
    @avatar.show().attr('src', link)

  offline: =>
    return unless not Setting.noAccount
    name = Setting.userName
    @setName("#{ name } - Offline")

  toggleAccount: ->
    Event.trigger 'settings:show'

  openSettings: ->
    Event.trigger 'settings:show'

module.exports = Panel
