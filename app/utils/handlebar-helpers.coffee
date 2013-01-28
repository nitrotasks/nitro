Handlebars.registerHelper 'addTags', (text) ->
  return unless text
  new Handlebars.SafeString text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/#(\w+)/g, ' <span class="tag">#$1</span>')
