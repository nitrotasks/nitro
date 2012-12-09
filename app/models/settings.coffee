Spine = require('spine')
List = require('models/list')

class Settings extends Spine.Model
  @configure 'Settings',
    'sort'

  constructor: ->
    super
    @sort ?= yes

  @sortMode: =>
    @first().sort

  @extend @Local

  @toggleSort: ->
    console.log @first()
    @first().updateAttribute "sort", !@first().sort
    @trigger "changeSort", List.current

module.exports = Settings
