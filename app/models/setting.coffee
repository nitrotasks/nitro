Spine = require('spine')
List = require('models/list')

class window.Setting extends Spine.Model
  @configure 'Setting',
    'sort',
    'username'

  constructor: ->
    super
    @sort ?= yes

  @set: (key, value) =>
    @first().updateAttribute key, value

  @sortMode: =>
    @first().sort

  @isPro: ->
    return true

  @extend @Local

  @toggleSort: ->
    @first().updateAttribute "sort", !@first().sort
    @trigger "changeSort", List.current

module.exports = Setting
