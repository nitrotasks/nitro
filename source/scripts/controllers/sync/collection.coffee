class CollectionSync

  constructor: (@model) ->

  listen: =>
    @model.on 'create:model', @oncreate
    @model.on 'change:model', @onupdate
    @model.on 'destroy:model', @ondestroy

  create: (item) =>
    @model.create(item)

  update: (item) =>
    @model.find(item.id).setAttributes(item)

  destroy: (id) =>
    @model.find(id).destroy()

  # override these
  oncreate: ->
  onupdate: ->
  ondestroy: ->

module.exports = CollectionSync
