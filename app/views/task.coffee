module.exports = """
<li id="task-{{ id }}" class="task {{#if group}}group{{/if}} {{#if completed }}completed{{/if}} p{{ priority }}">
  <div class="priority"></div>
  <div class="checkbox"></div>
  <div class="name">{{addTags name }}</div>
  <input type="text" class="input-name">
  <div class="right-controls">
    {{#if date}}
    <img style="display: inline-block" src="img/calendar.png"><input style="display: inline-block" class="date" placeholder="{{ dateplaceholder }}" value="{{date}}">
    {{else}}
    <img src="img/calendar.png"><input class="date" placeholder="{{ dateplaceholder }}" value="">
    {{/if }}
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
    <div class="notes placeholder"><div class="inner" contenteditable="true">{{ notesplaceholder }}</div></div>
  {{/if }}
</li>
"""
