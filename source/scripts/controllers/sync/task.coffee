class TaskSync

  constructor: (@model) ->

  listen: =>
    @model.on 'create:model', @oncreate
    @model.on 'change:model', @onupdate
    @model.on 'before:destroy:model', @ondestroy

  create: (item) =>
    @model.create(item)

  update: (item) =>
    model = @model.get(item.id)
    return unless model
    model.setAttributes(item)

  destroy: (item) =>
    model = @model.get(item.id)
    return unless model
    model.destroy()

  # override these
  oncreate: null
  onupdate: null
  ondestroy: null

module.exports = TaskSync
