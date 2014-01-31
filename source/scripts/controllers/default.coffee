
Task = require '../models/task'
List = require '../models/list'

module.exports =

  # Load default lists and tasks
  load: ->

    lists = require '../models/default/list.json'
    tasks = require '../models/default/task.json'

    for list in lists
      List.create list

    for task in tasks
      Task.create task