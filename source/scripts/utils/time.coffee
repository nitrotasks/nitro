# Return the time in seconds

Time =

  now: ->
    @from Date.now()

  from: (time) ->
    Math.floor time / 1000

  toDate: (time) ->
    time *= 1000
    new Date(time)

module.exports = Time