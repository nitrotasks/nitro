Mouse = require 'mouse'

mouse = new Mouse
  parent: 'section.tasks'
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

mouse.addMenu [

  delete: 'Delete'
,
  low:  'Low Priority'
  med:  'Medium Priority'
  high: 'High Priority'
,
  complete: 'Mark Completed'

], fadeOut: 300


mouse.on 'menu:delete', (items) ->
  for item in items
    item.task.destroy()

mouse.on 'menu:low', (items) ->
  for item in items
    item.task.priority = 1

mouse.on 'menu:med', (items) ->
  for item in items
    item.task.priority = 2

mouse.on 'menu:high', (items) ->
  for item in items
    item.task.priority = 3

mouse.on 'menu:complete', (items) ->
  for item in items
    item.task.completed = Date.now()

module.exports = mouse
