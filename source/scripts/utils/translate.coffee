$         = require 'jqueryify'
Setting   = require '../models/setting'
Event     = require '../utils/event'
languages = require '../languages/languages'

###
  Currently the app can only be translated once, as the original text
  is lost after translation.
  We could fix this by storing the original text on the element.
###

class Translate

  constructor: (@language) ->
    @dictionary = languages[@language]

    # Text
    $('.t').each (index, el) =>
      text = el.innerText
      if @exists text
        el.innerText = @convert text

    # Placeholder
    $('.p').each (index, el) =>
      placeholder = el.attributes.placeholder.value
      if @exists placeholder
        el.attributes.placeholder.value = @convert placeholder

    # Title
    $('.l').each (index, el) =>
      title = el.attributes.title.value
      if @exists title
        el.attributes.title.value = @convert title

  exists: (text) =>
    @dictionary.hasOwnProperty text

  convert: (text) =>
    if @exists text
      return @dictionary[text]
    return text

# WARNING: Temporary Placeholder for translate instance
translate =
  convert: ->
    throw new Error 'Translations not ready'

ready = false

module.exports = (text) ->

  if Array.isArray(text)
    translate.convert t for t in text

  else if typeof text is 'object'
    for k, v of text
      text[k] = translate.convert v
    text

  else
    translate.convert(text)

module.exports.init = ->
  translate = new Translate(Setting.language)
  ready = true
  Event.trigger 'translate:ready'

module.exports.ready = (fn) ->
  if ready then return fn()
  Event.on 'translate:ready', fn

