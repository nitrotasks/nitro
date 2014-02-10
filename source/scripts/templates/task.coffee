escape    = require '../utils/escape'
translate = require '../utils/translate'
tags      = require '../utils/tags'

text = translate
  checkbox:  'Mark as completed'


module.exports = (task) ->

  """
    <li id="task-#{ task.id }" class="task#{
      if task.group then ' group' else ''
    }#{
      if task.completed then ' completed' else ''
    } p#{ task.priority }">
      <div class="checkbox" title="#{ text.checkbox }"></div>
      <div class="name">#{ tags task.name }</div>
      <div class="date #{
        if task.date then '' else 'hidden'
      }">#{
        if task.date
          date = task.prettyDate()
          '<time class="' + date.classname + '">' + date.words + '</time>'
        else
          '<time></time>'
      }</div>
    </li>
  """
