class PrefSync

  constructor: (@model) ->

  listen: =>
    @model.on 'change', (key, value) =>
      @handleUpdate(key, value)

  create: =>
    throw new Error('Cannot create new pref')

  update: (item) =>
    @model.setAttributes(item)

  destroy: =>
    throw new Error('Cannot destroy pref')

  handleUpdate: (key, value) =>
    data = {}
    data[key] = value
    @onupdate({}, data)

  # override these
  oncreate: null
  onupdate: null
  ondestroy: null

module.exports = PrefSync
