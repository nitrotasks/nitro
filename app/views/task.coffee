addTags = (text) ->
  return unless text
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/#(\S+)/g, ' <span class="tag">#$1</span>')

module.exports = (data) ->
  """
    <li id="task-#{ data.id }" class="task #{
      if data.group then "group" else ""
    } #{
      if data.completed then "completed" else ""
    } p#{ data.priority }">
      <div class="checkbox" title="#{ data.checkboxalttext }"></div>
      <div class="name">#{ addTags data.name }</div>
      <input type="text" class="input-name">
      <div class="right-controls"> #{
        if data.date
          "<img width=\"10\" height=\"10\" style=\"display: inline-block\" src=\"img/calendar.png\"><time class=\"#{ data.dateClass }\">#{ data.dateValue }</time><input class=\"date\" placeholder=\"#{ data.dateplaceholder }\" value=\"#{ data.date }\">"
        else
          "<img width=\"10\" height=\"10\" src=\"img/calendar.png\"><time></time><input class=\"date\" placeholder=\"#{ data.dateplaceholder }\" value=\"\">"
        } #{
        if data.listName then "<span class=\"listName\">#{ data.listName }</span>" else ""
        } <div class="priority-button">
          <div data-id="1" title="#{ data.lowalttext }" class="low"></div>
          <div data-id="2" title="#{ data.mediumalttext }" class="medium"></div>
          <div data-id="3" title="#{ data.highalttext }" class="high"></div>
        </div>
        <div class="delete"></div>
      </div>
      #{
        if data.notes
          "<div class=\"notes\"><div class=\"inner\" contenteditable=\"true\">#{ data.notes }</div></div>"
        else
          "<div class=\"notes placeholder\"><div class=\"inner\" contenteditable=\"true\">#{ data.notesplaceholder }</div></div>"
      }
    </li>
  """
