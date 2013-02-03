Spine = require('spine')
List = require('models/list')

class window.Setting extends Spine.Model
  @configure 'Setting',
    'sort',
    'username',
    'weekStart',
    'dateFormat',
    'completedDuration',
    'confirmDelete',
    'offlineMode',
    'night',
    'language',
    'pro',
    'notifications',
    'notifyEmail',
    'notifyTime',
    'notifyRegular',
    'uid',
    'token',
    'user_name',
    'user_email',
    'oauth'

  constructor: ->
    super
    @sort ?= yes
    @username ?= "username"
    @weekStart ?= "1"
    @dateFormat ?= "dd/mm/yy"
    @completedDuration ?= "day"
    @confirmDelete ?= yes
    @night ?= no
    @language ?= "en-us"
    @pro ?= no
    @notifications ?= no
    @notifyEmail ?= no
    @notifyTime ?= 9
    @notifyRegular ?= "upcoming"

    $('html').addClass 'dark' if @night == yes

  @extend @Local

  # Change a setting
  # Setting.set("theme", "dark")
  @set: (key, value) =>
    @first().updateAttribute key, value
    return value

  @toggle: (key) =>
    @set key, !@get(key)

  # Get a setting
  # Setting.get("theme")
  @get: (key) =>
    @first()[key]

  @delete: (key) =>
    @set(key, null)
    return true

  @sortMode: =>
    @get "sort"

  # Check is user is pro
  @isPro: ->
    Setting.get "pro"

  @toggleSort: ->
    @toggle "sort"
    @trigger "changeSort", List.current

module.exports = Setting
