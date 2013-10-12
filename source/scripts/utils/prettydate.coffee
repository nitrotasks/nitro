translate = require '../utils/translate'

month = []

translate.ready ->
  month = translate [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

module.exports = (date) ->

  if date not instanceof Date
    return {
      words: ''
      className: ''
    }

  # Create Date
  now = new Date()
  difference = 0
  oneDay = 86400000; # 1000*60*60*24 - one day in milliseconds

  # Find difference between days
  difference = Math.ceil((date.getTime() - now.getTime()) / oneDay)

  words = ''
  className = ''

  ###

    Difference
    ==  5: '5 days left'
    ==  1: 'Due tomorrow'
    ==  0: 'Due today'
    == -1: 'Due yesterday'
    == -5: '5 days overdue'

  ###

  # Show difference nicely
  if difference is -1
    # Yesterday
    words = translate 'yesterday'
    className = 'overdue'

  else if difference < -1
    # Overdue

    # Make sure the difference is a positive number
    difference = Math.abs difference
    words = difference + ' ' + translate 'days ago'
    className = 'overdue'

  else if difference is 0
    # Due Today
    words = translate 'today'
    className = 'due'

  else if difference is 1
    # Due Tomorrow
    words = translate 'tomorrow'
    className = 'soon'

  else if difference < 15
    # Due in the next 15 days
    words = 'in ' + difference + ' days'

  else
    words = month[date.getMonth()] + ' ' + date.getDate()

  return {
    words: words
    className: className
  }