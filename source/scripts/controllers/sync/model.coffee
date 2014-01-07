class ModelSync

  constructor: (@model) ->

  listen: =>
    @model.on 'change', @onupdate

  create: =>

  update: (item) =>
    @model.setAttributes(item)

  destroy: =>

  # override these
  oncreate: ->
  onupdate: ->
  ondestroy: ->

module.exports = ModelSync
