translate = require '../utils/translate'

text = {}

translate.ready ->
  text = translate
    checkbox:  'Mark as completed'

tags = (text) ->
  return unless text
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/#(\S+)/g, ' <span class="tag">#$1</span>')

module.exports = (task) ->

  """
    <li id="task-#{ task.id }" class="task#{
      if task.completed then ' completed' else ''
    } p#{ task.priority }">
      <div class="checkbox" title="#{ text.checkbox }"></div>
      <div class="name">#{ tags task.name }</div>
      <div class="date #{
        if task.date then '' else 'hidden'
      }">#{
        if task.date
          '<time>' + task.prettyDate().words + '</time>'
        else
          '<time></time>'
      }</div>
    </li>
  """
