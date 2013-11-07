###

  Nitro Date
  ==========

  Reads a sentence and figures out a date for it.

  Written by George Czabania in February 2013.

###


class Now
  constructor: ->
    @time = new Date()
    @setup()

  setup: ->
    @day = @time.getDate()
    @weekDay = @time.getDay()
    @month = @time.getMonth() + 1
    @year = @time.getFullYear()

  print: (gap = '/') ->
    @day + @gap + @month + @gap + @year

  value: ->
    @time

  increment: (key, value) ->
    switch key
      when 'day'
        @time.setDate(@day + value)
      when 'month'
        @time.setMonth(--value)
      when 'year'
        @time.setYear(year)
      else
        return false
    @setup()
    return true

triggers = {}

defineTrigger = (trigger, fn) ->
  regexp = new RegExp(trigger, 'i')
  triggers[trigger] =
    regexp: regexp
    fn: fn

removeTrigger = (trigger) ->
  delete triggers[trigger]

dateParser = (text) ->
  for trigger, obj of triggers
    if match = text.match(obj.regexp)
      date = obj.fn(new Now(), match)
      return date?.value() or false
  return false


# Default Triggers
# ----------------

defineTrigger 'today', (now) ->
  return now

defineTrigger 'tomorrow', (now) ->
  now.increment('day', 1)
  return now

defineTrigger 'a week', (now) ->
  now.increment('day', 7)
  return now

defineTrigger 'next week', (now) ->
  now.increment('day', (8 - now.time.getDay()))
  return now

weekDays = [
  'sunday', 'monday', 'tuesday', 'wednesday',
  'thursday', 'friday', 'saturday'
]

defineTrigger "(#{ weekDays.join('|') })", (now, match) ->
  date = weekDays.indexOf(match[0].toLowerCase())
  diff = date - now.weekDay
  now.increment('day', diff)
  if diff <= 0
    now.increment('day', 7)
  return now


api =
  parse: dateParser
  define: defineTrigger
  remove: removeTrigger

module?.exports = api
