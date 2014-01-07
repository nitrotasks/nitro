
CLASSNAME = 'queue'

CREATE = 'create'
UPDATE = 'update'
DESTROY = 'destroy'

class Queue

  constructor: ->
    @queue = JSON.parse localStorage[CLASSNAME] or '[]'

  clear: ->
    @queue = []
    @save()

  push: (event, arg1, arg2, arg3) ->
    if event in [CREATE, UPDATE, DESTROY]
      now = Date.now()
      if event is UPDATE
        time = {}
        time[key] = now for own key of arg1 when key isnt 'id'
      else
        time = now
    @queue.push [item, arg1, arg2, arg3, time]
    @optimize()

  # Merges events together to make syncing faster
  # create + update = create
  # create + destroy = nothing
  # update + destroy = destroy
  # update + update + update = update
  optimize: ->
    queue = []
    models = {}

    # Sort events into groups by item ID
    for event in @queue
      [type, [className, model], time] = event
      switch type
        when 'create', 'update' then item = model
        when 'destroy' then item = {id: model}

      if not models.hasOwnProperty className
        models[className] = {}

      if not models[className].hasOwnProperty(item.id)
        models[className][item.id] = []

      models[className][item.id].push event

    # Loop through each model e.g. Task and List
    for className, items of models

      # Loop through each item in that model
      for id, events of items

        # Sort events into chronological order
        events.sort (a,b) ->
          time =
            a: 0
            b: 0

          for x, i in [a,b]
            if typeof x[2] is 'object'
              times = []
              times.push time for key, time of x[2]
              value = Math.max.apply this, times
            else value = x[2]

            if i is 0
              time.a = value
            else
              time.b = value

          time.a - time.b

        # Hold the last model to have that ID
        section =
          create: no
          update: []
          destroy: no

        # Get the last models events that had that id
        for index in [events.length-1..0]
          # Stop as soon af we have a create event
          break if section.create isnt no
          event = events[index]
          type = event[0]
          switch type
            when 'create'
              section.create = event
            when 'update'
              section.update.unshift event
            when 'destroy'
              section.destroy = event

        # Merge update and destroy events
        if section.destroy and section.update.length
          queue.push section.destroy
          continue

        lastUpdate = {}
        timestamps = {}

        # Merge update events
        for event in section.update
          [type, [cN, model], time] = event
          for own key, value of model
            if value isnt lastUpdate[key]
              lastUpdate[key] = value
              timestamps[key] = time[key] unless key is 'id'

        # Merge create and update events
        if section.create and not section.destroy and section.update.length
          # Push updates onto original task
          for key, val of lastUpdate
            section.create[1][1][key] = val
          # Get latest update time
          times = []
          times.push time for key, time of timestamps
          section.create[2] = Math.max.apply this, times
          # Add to queue
          queue.push section.create
          continue

        # Present event as a queue
        if not (section.create and section.destroy)

          # Add create event
          queue.push section.create if section.create

          # Add update event(s)
          if section.update.length
            queue.push ['update', [className, lastUpdate], timestamps]

          # Add destroy events
          queue.push section.destroy if section.destroy

    # Save queue
    @queue = queue
    @save()
    true

  @save: =>
    localstorage[CLASSNAME] = JSON.stringify @queue

module.exports = new Queue
