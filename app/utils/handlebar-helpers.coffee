Handlebars.registerHelper 'addTags', (text) ->
  new Handlebars.SafeString text.replace(/#(\w+)/g, ' <span class="tag">#$1</span>')
