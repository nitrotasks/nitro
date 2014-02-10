# From Mustache.js
# https://github.com/janl/mustache.js/blob/96c43e4c21df692f7d17a9cc4dedd171e583cd9b/mustache.js#L47-L60

entityMap =
  '&': '&amp;'
  '<': '&lt;'
  '>': '&gt;'
  '"': '&quot;'
  "'": '&#39;'
  '/': '&#x2F;'

escapeHtml = (string) ->
  String(string).replace /[&<>"'\/]/g, (s) -> entityMap[s]

module.exports = escapeHtml