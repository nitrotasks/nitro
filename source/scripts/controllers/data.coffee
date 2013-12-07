List = require '../models/list'
Task = require '../models/task'
User = require '../models/user'
Setting = require '../models/setting'

module.exports =

  export: ->
    JSON.stringify
      task: Task.toJSON()
      list: List.toJSON()
      user: User.toJSON()
      setting: Setting.toJSON()
    , null, 2

  import: (json) ->
    data = JSON.parse json
    Task.refresh data.task, true
    List.refresh data.list, true
    User.refresh data.user, true
    Setting.refresh data.setting, true
