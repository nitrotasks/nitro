Setting   = require '../models/setting'
event     = require '../utils/event'
languages = require '../languages/languages'

# Lookup array to get a text ID
lookup = languages.default

# WARNING: Temporary Placeholder for translate instance
translate =
  convert: ->
    throw new Error 'Translations not ready'

clone = (obj) ->
  if Array.isArray obj
    return obj.slice()
  copy = {}
  for key, value of obj
    copy[key] = value
  return copy

class Translate

  @loaded = false

  ###*
   * - text (Object) : Must be an array or an object
  ###

  @bind: (text, alreadyBound) =>

    # Strings don't get auto updating magic
    if @loaded and typeof text is 'string'
      return translate.convert text

    # If we have already loaded a language,
    # then convert the text straight away
    if @loaded

      if text.__original
        obj = text.__original
      else
        obj = text.__original = clone text

      if Array.isArray text

        for item, i in obj
          text[i] = translate.convert item

      else
        for key, val of obj
          text[key] = translate.convert val

    # Automatically reconvert text when the language changes
    if not alreadyBound

      event.on 'load:language', =>
        @bind text, true

    return text


  constructor: () ->
    Setting.on 'change:language', @setLanguage

  setLanguage: (@language) =>
    @dictionary = languages[@language] || {}
    @elements()
    Translate.loaded = true
    event.trigger 'load:language'

  elements: =>

    $ = require 'jqueryify'

    # Text
    $('.t').each (index, el) =>

      if el.__translate_text
        text = el.__translate_text
      else
        text = el.innerHTML
        el.__translate_text = text

      el.innerHTML = @convert text

    # Placeholder
    $('.p').each (index, el) =>

      if el.__translate_placeholder
        text = el.__translate_placeholder
      else
        text = el.attributes.placeholder.value
        el.__translate_placeholder = text

      el.attributes.placeholder.value = @convert text

    # Title
    $('.l').each (index, el) =>

      if el.__translate_title
        text = el.__translate_title
      else
        text = el.attributes.title.value
        el.__translate_title = text

      el.attributes.title.value = @convert title

  id: (text) =>
    lookup.indexOf text

  exists: (id) =>
    @dictionary.hasOwnProperty id

  convert: (text) =>
    id = @id text
    if @exists id
      return @dictionary[id]
    return text

module.exports = Translate.bind

module.exports.init = ->
  translate = new Translate()
  translate.setLanguage Setting.language
