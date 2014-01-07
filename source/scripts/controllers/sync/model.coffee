class ModelSync

  constructor: (@model) ->

  listen: =>
    @on 'change', @onupdate

  create: =>

  update: (item) =>
    @model.setAttributes(item)

  destroy: =>

  # override these
  oncreate: ->
  onupdate: ->
  ondestroy: ->


