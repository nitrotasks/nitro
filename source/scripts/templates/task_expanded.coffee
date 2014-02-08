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
      <div class="priority-toggle">
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
           width="10px" height="11px" viewBox="0 0 10 11" enable-background="new 0 0 10 11" xml:space="preserve">
        <g id="flag">
          <path d="M10,0c0,1,0,2,0,5C8,9,5,4,2,7c0-2,0-3,0-5C3-2,8,4,10,0z M1,0H0v11h1V0z"/>
        </g>
        </svg>
      </div>
      <textarea class='notes editable #{
        if task.notes then '' else 'placeholder'
      }'>#{
        if task.notes then task.notes else text.notes
      }</textarea>
    </li>
  """
