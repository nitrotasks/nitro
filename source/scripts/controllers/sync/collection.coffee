class CollectionSync

  constructor: (@model) ->

  listen: =>
    @model.on 'create:model', @oncreate
    @model.on 'change:model', @onupdate
    @model.on 'before:destroy:model', @ondestroy

  create: (item) =>
    console.log 'creating', item
    @model.create(item)

  update: (item) =>
    console.log 'updating', item
    model = @model.get(item.id)
    return unless model
    model.setAttributes(item)

  destroy: (item) =>
    console.log 'destroying', item
    model = @model.get(item.id)
    return unless model
    model.destroy()

  # override these
  oncreate: null
  onupdate: null
  ondestroy: null

module.exports = CollectionSync
