# Add localStorage support to Base.Collection and Base.Model
Base = require 'base'

# chrome.storage polyfill that uses localStorage
localStore =

  get: (key, fn) ->
    fn JSON.parse localStorage[key] || '{}'
    return

  set: (key, value) ->
    localStorage[key] = JSON.stringify value


# chrome.storage with a sane api
chromeStore =

  get: (key, fn) ->
    console.log 'GET', key
    chrome.storage.local.get key, (value) ->
      console.log 'GOT', key, value
      fn value[key] || {}

  set: (key, value) ->
    obj = {}
    obj[key] = value
    console.log 'SET', key, obj
    chrome.storage.local.set obj
    

# Toggle between chrome.storage and localStorage
if window.chrome?.storage?
  database = chromeStore
else
  database = localStore


database.include = (model) ->
  new Local(model)


class Local

  constructor: (@model) ->
    @model.on 'fetch', @fetch
    @model.on 'refresh save change', @save
    if @model instanceof Base.Collection
      @model.on 'save:model change:model', @save

  fetch: =>
    database.get @model.className, (value) =>
      @model.refresh value, true

  save: =>
    database.set @model.className, @model.toJSON()

module.exports = database
