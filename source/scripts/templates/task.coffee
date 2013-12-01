prettyDate = require '../utils/prettydate'
translate = require '../utils/translate'

text = {}

translate.ready ->

  text = translate
    notes:     'Notes'
    date:      'Due Date'
    checkbox:  'Mark as completed'
    low:       'Set priority to low'
    medium:    'Set priority to medium'
    high:      'Set priority to high'

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
    </li>
  """
