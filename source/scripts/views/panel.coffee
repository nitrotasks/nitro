Base = require 'base'
List = require '../models/list'
Task = require '../models/task'
User = require '../models/user'
event = require '../utils/event'
md5 = require '../vendor/md5'

class Panel extends Base.View

  el: '.panel'

  ui:
    avatar: '.avatar .img'
    name: '.user .name'

  events: Base.touchify
    'click .user':          'toggleAccount'
    'click .openSettings':  'openSettings'

  constructor: ->
    super

    @listen User,
      'login':         @login
      'offline':       @offline
      'change:name':   @setName
      'change:email':  @setAvatar

    if User.authenticated then @login()

  login: =>
    @setName()
    @setAvatar()

  setName: (name=User.name) =>
    @ui.name.text(name)

  setAvatar: =>
    email = User.email?.toLowerCase()
    id = md5(email)
    link = "http://www.gravatar.com/avatar/#{ id }/?d=retro"
    @ui.avatar.css('background-image', "url(#{ link })")

  offline: =>
    return unless not User.noAccount
    @setName User.name + ' - Offline'

  toggleAccount: ->
    event.trigger 'settings:show'

  openSettings: ->
    event.trigger 'settings:show'

module.exports = Panel
