List = require '../models/list'

module.exports = (list) ->
  """
    <li data-item="#{ list.id }" class="list#{ 
    	if List.current?.id is list.id
    		" current"
    	else
    		""
    }">
      <div class="arrow"></div>
      <span class="name">#{ list.name }</span>
      <div class="count">#{ list.tasks.length }</div>
    </li>
  """
