class TaskSync

  constructor: (@model) ->

  listen: =>
    @model.on 'create:model', @oncreate
    @model.on 'change:model', @handleUpdate
    @model.on 'before:destroy:model', @ondestroy

  create: (item) =>
    @model.create(item)

  update: (item) =>
    model = @model.get(item.id)
    return unless model
    delete item.id
    model.setAttributes(item)

  destroy: (item) =>
    model = @model.get(item.id)
    return unless model
    model.destroy()

  handleUpdate: (model, key, value) =>
    data = id: model.id
    data[key] = value
    @onupdate(data)

  # override these
  oncreate: null
  onupdate: null
  ondestroy: null

module.exports = TaskSync
