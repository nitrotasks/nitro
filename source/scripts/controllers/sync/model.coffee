class ModelSync

  constructor: (@model) ->

  listen: =>
    @model.on 'change', (key, value) =>
      @onupdate(@model, key, value)

  create: =>

  update: (item) =>
    @model.setAttributes(item)

  destroy: =>

  # override these
  oncreate: ->
  onupdate: ->
  ondestroy: ->

module.exports = ModelSync
