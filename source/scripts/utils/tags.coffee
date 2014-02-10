escape = require '../utils/escape'

tags = (text) ->
  return '' unless text
  return escape(text)
    .replace(/&#/g, '__AMPERSAND_OCTOTHORPE__')
    .replace(/#([^#\s]+)/g, '<span class="tag">#$1</span>')
    .replace(/__AMPERSAND_OCTOTHORPE__/g, '&#')

module.exports = tags