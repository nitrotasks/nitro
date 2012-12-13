module.exports = """
<li id="task-{{ id }}" class="task {{#if group}}group{{/if}} {{#if completed }}completed{{/if}} p{{ priority }}">
  <div class="priority"></div>
  <div class="checkbox"></div>
  <div class="name" contenteditable="true">{{addTags name }}</div>
  <div class="right-controls">
    <img src="img/calendar.png"><input class="date" placeholder="Due Date"{{#if date}}value="{{date}}"{{/if }}>
    <div class="priority-button">
      <div data-id="1" class="low"></div>
      <div data-id="2" class="medium"></div>
      <div data-id="3" class="high"></div>
    </div>
    <div class="delete"></div>
  </div>
  {{#if notes }}
    <div class="notes"><div class="inner" contenteditable="true">{{{notes}}</div></div>
  {{else}}
    <div class="notes placeholder"><div class="inner" contenteditable="true">Notes</div></div>
  {{/if }}
</li>
"""
