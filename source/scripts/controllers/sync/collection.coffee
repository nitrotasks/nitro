class CollectionSync

  constructor: (@model) ->

  listen: =>
    @model.on 'create:model', @oncreate
    @model.on 'change:model', @onupdate
    @model.on 'before:destroy:model', @ondestroy

  create: (item) =>
    @model.create(item)

  update: (item) =>
    @model.get(item.id).setAttributes(item)

  destroy: (id) =>
    @model.get(id).destroy()

  # override these
  oncreate: null
  onupdate: null
  ondestroy: null

module.exports = CollectionSync
