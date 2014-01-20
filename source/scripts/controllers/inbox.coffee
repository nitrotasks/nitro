# TODO: Find somewhere to put this


List = require '../models/list'

setupInbox = ->
  return if List.exists 'inbox'
  console.log 'setting up inbox'

  List.create
    id: 'inbox'
    name: 'Inbox'

List.on 'refresh', setupInbox

module.exports = setupInbox