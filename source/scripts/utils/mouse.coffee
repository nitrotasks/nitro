Mouse = require 'mouse'


###*
 * SELECT BOX + DRAGGABLE
###


mouse = new Mouse
  parent: 'section.tasks'
  query: '.task'
  select: true
  sort: true
  drag:
    offsetY: -31
    offsetX: 0
    helper: (elements) ->
      length = elements.length
      return "Moving #{ length } task#{ if length > 1 then 's' else ''}"

###*
 * DROPPABLES
###

mouse.on 'drop', (elements, zone) ->
  list = zone.list
  for el in elements
    el.task.list().moveTask(el.task, list)


###*
 * SORTABLE
###

mouse.on 'sort', (items, position) ->

  collection = items[0].task.collection

  for item in items by -1
    collection.move item.task, position, true

  collection.reindex()

###*
 * MENU ITEMS
###

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
