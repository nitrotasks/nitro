Spine = require('spine')
List = require('models/list')

class window.Setting extends Spine.Model
  @configure 'Setting',
    'sort',
    'username',
    'theme'

  constructor: ->
    super
    @sort ?= yes
    @username ?= "username"
    @theme ?= "light"

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
