Mouse = require 'mouse'

mouse = new Mouse
  parent: '.tasks'
  query: '.task'
  offsetY: -31
  offsetX: 0
  helper: (elements) ->
    length = elements.length
    return "Moving #{ length } task#{ if length > 1 then 's' else ''}"

mouse.on 'drop', (elements, zone) ->
  list = zone.list
  for el in elements
    el.task.list().moveTask(el.task, list)

module.exports = mouse
