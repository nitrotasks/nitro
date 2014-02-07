Task = require '../models/task'
List = require '../models/list'

module.exports =

  # Load default lists and tasks
  load: ->

    inbox = null

    lists = require '../models/default/list.json'
    tasks = require '../models/default/task.json'

    inbox = List.create lists[0]

    for task in tasks
      Task.create task

    inbox.trigger 'select'