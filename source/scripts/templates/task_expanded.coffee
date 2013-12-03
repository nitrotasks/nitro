prettyDate = require '../utils/prettydate'
translate = require '../utils/translate'

text = {}

translate.ready ->

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

  date = prettyDate(task.date)

  """
    <li id="task-#{ task.id }" class="expanded-task task#{
      if task.completed then ' completed' else ''
    } p#{ task.priority }">
      <div class="checkbox" title="#{ text.checkbox }"></div>
      <input type="text" class="input-name" value="#{ task.name }">
      <div class="right-controls">#{
        if task.date
          "<img width='10' height='10' src='img/calendar.png'>
          <input class='date' placeholder='#{ text.date
            }' value='#{ task.date }'>"
        else
          "<img width='10' height='10' src='img/calendar.png'>
          <input class='date' placeholder='#{ text.date }' value=''>"
      }
      </div>
      <textarea class='notes editable #{
        if task.notes then '' else 'placeholder'
      }'>#{
        if task.notes then task.notes else 'Notes'
      }</textarea>
    </li>
  """
