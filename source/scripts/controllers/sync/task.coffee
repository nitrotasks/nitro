class TaskSync

  constructor: (@model) ->

  listen: =>
    @model.on 'create:model', @handleCreate
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

  handleCreate: (model) =>
    data = model.toJSON()
    delete data.id
    @oncreate(model, data)

  handleUpdate: (model, key, value) =>
    obj = {}
    obj[key] = value
    @onupdate(model, obj)

  # override these
  oncreate: null
  onupdate: null
  ondestroy: null



module.exports = TaskSync
