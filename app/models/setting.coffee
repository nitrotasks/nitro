Spine = require('spine')
List = require('models/list')

class window.Setting extends Spine.Model
  @configure 'Setting',
    'sort',
    'username',
    'weekStart',
    'dateFormat',
    'confirmDelete',
    'offlineMode',
    'night',
    'language'

  constructor: ->
    super
    @sort ?= yes
    @username ?= "username"
    @weekStart ?= "1"
    @dateFormat ?= "dd/mm/yy"
    @confirmDelete ?= yes
    @night ?= no
    @language ?= "en-us"

    $('html').addClass 'dark' if @night == yes

  @extend @Local

  # Change a setting
  # Setting.set("theme", "dark")
  @set: (key, value) =>
    @first().updateAttribute key, value
    value

  @toggle: (key) =>
    @set key, !@get(key)

  # Get a setting
  # Setting.get("theme")
  @get: (key) =>
    @first()[key]

  @sortMode: =>
    @get "sort"

  # Check is user is pro
  @isPro: ->
    return true

  @toggleSort: ->
    @toggle "sort"
    @trigger "changeSort", List.current

module.exports = Setting
