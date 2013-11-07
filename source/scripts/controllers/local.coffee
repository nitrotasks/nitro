# Add localStorage support to Base.Collection and Base.Model
Base = require 'base'

class Local

  constructor: (@model) ->
    @model.on 'fetch', @fetch
    @model.on 'save change', @save
    if @model instanceof Base.Collection
      @model.on 'save:model change:model', @save

  fetch: =>
    json = localStorage[@model.className]
    return unless typeof json is 'string'
    @model.refresh JSON.parse(json), true

  save: =>
    json = JSON.stringify @model.toJSON()
    localStorage[@model.className] = json

module.exports = Local