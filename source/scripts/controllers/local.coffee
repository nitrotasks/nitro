# Add localStorage support to Base.Collection and Base.Model
Base = require 'base'

localStore =

  get: (key, fn) =>
    fn JSON.parse localStorage[key]
    return

  set: (items) =>
    for key, value of items
      localStorage[key] = JSON.stringify value
    return

class Local

  constructor: (@model) ->
    @model.on 'fetch', @fetch
    @model.on 'save change', @save
    if @model instanceof Base.Collection
      @model.on 'save:model change:model', @save

  fetch: =>
    localStore.get @model.className, (value) =>
      @model.refresh value, true

  save: =>
    obj = {}
    obj[@model.className] = @model.toJSON()
    localStore.set obj

module.exports = Local
