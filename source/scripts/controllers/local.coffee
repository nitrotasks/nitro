# Add localStorage support to Base.Collection

class Local

  constructor: (@model) ->
    @model.on 'fetch', @fetch
    @model.on 'save:model create:model change:model remove:model', @save

  fetch: =>
    result = JSON.parse localStorage[@model.className] or '[]'
    @model.refresh result, true

  save: =>
    localStorage[@model.className] = JSON.stringify @model.toJSON()


module.exports = Local