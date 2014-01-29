List = require '../models/list'
Task = require '../models/task'
User = require '../models/user'
Pref = require '../models/pref'

module.exports =

  export: ->
    JSON.stringify
      task: Task.toJSON()
      list: List.toJSON()
      user: User.toJSON()
      pref: Pref.toJSON()
    , null, 2

  import: (json) ->
    data = JSON.parse json
    Task.refresh data.task, true
    List.refresh data.list, true
    User.refresh data.user, true
    Pref.refresh data.pref, true
