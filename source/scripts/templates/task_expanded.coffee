translate = require '../utils/translate'

text = translate
  notes:     'Notes'
  date:      'Due Date'
  checkbox:  'Mark as completed'

tags = (text) ->
  return unless text
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/#(\S+)/g, ' <span class="tag">#$1</span>')

module.exports = (task) ->

  date = task.prettyDate()

  """
    <li id="task-#{ task.id }" class="expanded-task task#{
      if task.completed then ' completed' else ''
    } p#{ task.priority }">
      <div class="checkbox" title="#{ text.checkbox }"></div>
      <input type="text" class="input-name" value="#{ task.name }">
      <div class="date #{
        if date.words then '' else 'hidden'
      }">
        <input class="input-date" placeholder='#{ text.date
        }' value='#{ date.words }'>
      </div>
      <textarea class='notes editable #{
        if task.notes then '' else 'placeholder'
      }'>#{
        if task.notes then task.notes else text.notes
      }</textarea>
    </li>
  """
