module.exports = (data) ->
  """
    <li data-item="#{ data.id }" class="list">
      <div class="arrow"></div>
      <div class="name">#{ data.name }</div>
      <div class="count">#{ data.count }</div>
    </li>
  """
