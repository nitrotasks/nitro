translate = require '../utils/translate'

module.exports = (date) ->

  month = []
  translate.ready ->
    month = translate [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]
    console.log month

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
    words = $.i18n._ 'yesterday'
    className = 'overdue'

  else if difference < -1
    # Overdue

    # Make sure the difference is a positive number
    difference = Math.abs difference
    words = difference + ' ' + $.i18n._ 'days ago'
    className = 'overdue'

  else if difference is 0
    # Due Today
    words = $.i18n._ 'today'
    className = 'due'

  else if difference is 1
    # Due Tomorrow
    words = $.i18n._ 'tomorrow'
    className = 'soon'

  else if difference < 15
    # Due in the next 15 days
    words = 'in ' + difference + ' days'

  else
    words = month[date.getMonth()] + ' ' + date.getDate()

  {
    words: words
    className: className
  }
