Mouse = require 'mouse'
List = require '../models/list'


###*
 * SELECT BOX + DRAGGABLE
###

lists = new Mouse
  parent: 'ul.lists'
  query: '.list'
  select: false
  sort: true
  drag:
    classname: 'lists'
    offsetY: -31
    offsetX: 0
    helper: (element) ->
      return element[0].getElementsByClassName('name')[0].innerText

tasks = new Mouse
  parent: 'section.tasks'
  query: '.task'
  select: true
  sort: true
  drag:
    classname: 'tasks'
    offsetY: -31
    offsetX: 0
    helper: (elements) ->
      length = elements.length
      return "Moving #{ length } list#{ if length > 1 then 's' else ''}"

###*
 * DROPPABLES
###

tasks.on 'drop', (elements, zone) ->
  list = zone.list
  for el in elements
    el.task.list().moveTask(el.task, list)


###*
 * SORTABLE
###

tasks.on 'sort', (items, position) ->

  collection = items[0].task.collection

  for item in items by -1
    collection.move item.task, position

lists.on 'sort', (item, position) ->
  List.move item[0].list, position


###*
 * MENU ITEMS
###

tasks.addMenu [

  delete: 'Delete'
,
  low:  'Low Priority'
  med:  'Medium Priority'
  high: 'High Priority'
,
  complete: 'Mark Completed'

], fadeOut: 300

tasks.on 'menu:delete', (items) ->
  for item in items
    item.task.destroy()

tasks.on 'menu:low', (items) ->
  for item in items
    item.task.priority = 1

tasks.on 'menu:med', (items) ->
  for item in items
    item.task.priority = 2

tasks.on 'menu:high', (items) ->
  for item in items
    item.task.priority = 3

tasks.on 'menu:complete', (items) ->
  for item in items
    item.task.completed = Date.now()

module.exports =
  init: ->
    lists.init()
    tasks.init()
  lists: lists
  tasks: tasks
