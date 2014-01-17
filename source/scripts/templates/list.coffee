module.exports = (list) ->
  """
    <li data-item="#{ list.id }" class="list">
      <span class="name">#{ list.name }</span>
      <div class="count">#{ list.tasks.length }</div>
    </li>
  """
