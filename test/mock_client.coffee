# Generate strings for Jandal
# CLIENT VERSION

emit = (event, args...) ->
  string = event
  string += '('
  string += JSON.stringify(args)[1...-1]
  string += ')'

  if client.callback
    string += '.fn('
    string += ++client.id
    string += ')'

  return string

client =

  id: -1
  callback: true
  setId: (id) ->
    client.id = id - 1

  queue:

    sync: (queue) ->
      emit 'queue.sync', queue

  user:

    auth: (id, token) ->
      emit 'user.auth', id, token

    info: ->
      emit 'user.info'

  task:

    fetch: ->
      emit 'task.fetch'

    create: (model) ->
      emit 'task.create', model

    update: (model) ->
      emit 'task.update', model

    destroy: (model) ->
      emit 'task.destroy', model

  list:

    create: (model) ->
      emit 'list.create', model

    update: (model) ->
      emit 'list.update', model

    destroy: (model) ->
      emit 'list.destroy', model

  pref:

    update: (model) ->
      emit 'pref.update', model


module.exports = client