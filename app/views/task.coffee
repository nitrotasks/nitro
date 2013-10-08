date = require '../utils/prettydate'
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
      if task.group then ' group' else ''
    }#{
      if task.completed then ' completed' else ''
    } p#{ task.priority }">
      <div class="checkbox" title="#{ text.checkbox }"></div>
      <div class="name">#{ tags task.name }</div>
      <input type="text" class="input-name">
      <div class="right-controls">#{
        if task.date
          "<img width='10' height='10' style='display: inline-block' src='img/calendar.png'>
          <time class='#{ date(task).class }'>#{ date(task).value }</time>
          <input class='date' placeholder='#{ text.date }' value='#{ task.date }'>"
        else
          "<img width='10' height='10' src='img/calendar.png'>
          <time></time>
          <input class='date' placeholder='#{ text.date }' value=''>"
      }#{
        if task.listName
          "<span class='listName'>#{ task.listName }</span>"
        else
          ""
        }
        <div class="priority-button">
          <div data-id="1" title="#{ text.low }" class="low"></div>
          <div data-id="2" title="#{ text.medium }" class="medium"></div>
          <div data-id="3" title="#{ text.high }" class="high"></div>
        </div>
        <div class="delete"></div>
      </div>
      #{
        if task.notes
          "<div class='notes'>
            <div class='inner' contenteditable='true'>#{ task.notes }</div>
          </div>"
        else
          "<div class='notes placeholder'>
            <div class='inner' contenteditable='true'>#{ text.notes }</div>
           </div>"
      }
    </li>
  """
