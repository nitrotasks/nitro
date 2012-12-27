Handlebars.registerHelper 'addTags', (text) ->
  return unless text
  new Handlebars.SafeString text.replace(/#(\w+)/g, ' <span class="tag">#$1</span>')
