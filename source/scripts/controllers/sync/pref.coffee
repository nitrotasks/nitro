class PrefSync

  constructor: (@model) ->

  listen: =>
    @model.on 'change', (key, value) =>
      @onupdate(@model, key, value)

  create: =>
    throw new Error('Cannot create new pref')

  update: (item) =>
    @model.setAttributes(item)

  destroy: =>
    throw new Error('Cannot destroy pref')

  # override these
  oncreate: null
  onupdate: null
  ondestroy: null

module.exports = PrefSync
