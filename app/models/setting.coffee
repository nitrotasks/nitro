Spine = require('spine')
List = require('models/list')

class Setting extends Spine.Model
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

  @extend @Local

  @toggleSort: ->
    console.log @first()
    @first().updateAttribute "sort", !@first().sort
    @trigger "changeSort", List.current

module.exports = Setting
