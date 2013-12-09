$         = require 'jqueryify'
Setting   = require '../models/setting'
event     = require '../utils/event'
languages = require '../languages/languages'

lookup = languages.default

###
  Currently the app can only be translated once, as the original text
  is lost after translation.
  We could fix this by storing the original text on the element.
###

class Translate

  constructor: () ->
    Setting.on 'change:language', @setLanguage

  setLanguage: (@language) =>
    @dictionary = languages[@language] || {}
    @elements()
    event.trigger 'load:language'

  elements: =>

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

# WARNING: Temporary Placeholder for translate instance
translate =
  convert: ->
    throw new Error 'Translations not ready'

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
  translate = new Translate()
  translate.setLanguage Setting.language
