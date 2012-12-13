Spine = require('spine')
List = require('models/list')

class window.Setting extends Spine.Model

  @extend @Local

  @configure 'Setting',
    'sort',
    'username',
    'theme'

  constructor: ->
    super
    @sort ?= yes

  # Change a setting
  # Setting.set("theme", "dark")
  @set: (key, value) =>
    @first().updateAttribute key, value
    true

  @toggle: (key) =>
    @set key, !@get(key)

  # Get a setting
  # Setting.get("theme")
  @get: (key) =>
    @first()[key]

  # Return sort mode
  @sortMode: =>
    @get("sort")

  # Check is user is pro
  @isPro: ->
    return true

  # Toggle sort
  @toggleSort: ->
    @toggle "sort"
    @trigger "changeSort", List.current

module.exports = Setting
