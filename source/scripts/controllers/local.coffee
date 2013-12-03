# Add localStorage support to Base.Collection and Base.Model
Base = require 'base'

localStore =

  get: (key, fn) =>
    fn JSON.parse localStorage[key]
    return

  set: (items) =>
    console.log items
    for key, value of items
      localStorage[key] = JSON.stringify value
    return


if window.chrome?.storage?
  database = chrome.storage.local
else
  database = localStore

class Local

  constructor: (@model) ->
    @model.on 'fetch', @fetch
    @model.on 'save change', @save
    if @model instanceof Base.Collection
      @model.on 'save:model change:model', @save

  fetch: =>
    database.get @model.className, (value) =>
      @model.refresh value, true

  save: =>
    obj = {}
    obj[@model.className] = @model.toJSON()
    database.set obj

module.exports = Local
