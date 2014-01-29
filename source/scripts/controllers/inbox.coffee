# TODO: Find somewhere to put this

List = require '../models/list'
User = require '../models/user'

setupInbox = ->

  return if List.exists User.inbox

  List.create
    id: User.inbox
    name: 'Inbox'

  List.get(User.inbox).on 'change:id', (id) ->
    User.inbox = id

List.on 'refresh', setupInbox

module.exports = setupInbox