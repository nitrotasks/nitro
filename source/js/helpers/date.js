const dayms = 1000 * 60 * 60 * 24
let language = 'en-US'
if (typeof navigator !== 'undefined' && 'language' in navigator) {
  language = navigator.language
}

// set the second digit to the day that the week starts on
const workday = 7 + 1

export function formatDate(date, type, showToday = 'no') {
  // ???
  if (type === 'next' && date === null) {
    return 'Next'
  }

  if (typeof date === 'undefined' || date === null) {
    return ''
  }

  if (typeof date === 'string') {
    return date
  }

  // changes dates today or past, to 'today'
  const currentDate = new Date()
  if (currentDate.getHours() <= 3) {
    currentDate.setDate(currentDate.getDate() - 1)
  }
  if (showToday === 'deadline') {
    const due = date - currentDate
    if (due < 7 * dayms) {
      const days = Math.floor((due * -1) / dayms)
      if ((dayms * -1 < due && due < dayms && date.getDate() - currentDate.getDate() === 0) || days === 0) {
        return 'due today'
      }
      if (due < 0) {
        if (days === 1) {
          return '1 day overdue'
        }
        return days + ' days overdue'
      }
      const left = (date.getDate() - currentDate.getDate())
      if (left === 1) {
        return '1 day left'
      }
      return left + ' days left'
    }
  } else if (showToday === 'today' && date < currentDate) {
    return 'Today'
  } else if (showToday !== 'no') {
    const days = Math.ceil((date.getTime() - currentDate.getTime()) / dayms)
    if (days === 1) {
      return 'Tomorrow'
    } else if (days > 0 && days < 7) {
      return date.toLocaleDateString(language, { weekday: 'long' })
    }
  }

  return date.toLocaleDateString(language, { month: 'short', day: 'numeric' })
}

export const dateValue = function(value) {
  const newData = {
    type: 'task'
  }
  const currentDate = new Date()
  if (value === null) {
    newData.date = null
  } else if (value.constructor === Date) {
    newData.date = value
  } else if (value === 'today') {
    newData.date = new Date()
    newData.date.setSeconds(newData.date.getSeconds() - 1)
    if (currentDate.getHours() <= 3) {
      newData.date.setDate(newData.date.getDate() - 1)
    }
  } else if (value === 'tomorrow') {
    newData.date = new Date()
    if (currentDate.getHours() > 3) {
      newData.date.setDate(newData.date.getDate() + 1)
    }
  } else if (value === 'nextweek') {
    newData.date = new Date()
    newData.date.setDate(
      newData.date.getDate() + (workday - newData.date.getDay())
    )
  } else if (value === 'next') {
    newData.type = 'next'
    newData.date = null
  } else if (value === 'someday') {
    newData.type = 'someday'
    newData.date = null
  }
  return newData
}

export const deadlineValue = function(value) {
  const newData = {}
  const currentDate = new Date()
  if (value === null) {
    newData.deadline = null
  } else if (value.constructor === Date) {
    newData.deadline = value
  } else if (value === 'today') {
    newData.deadline = new Date()
    if (currentDate.getHours() <= 3) {
      newData.deadline.setDate(newData.deadline.getDate() - 1)
    }
  } else if (value === 'tomorrow') {
    newData.deadline = new Date()
    if (currentDate.getHours() > 3) {
      newData.deadline.setDate(newData.deadline.getDate() + 1)
    }
  } else if (value === 'nextweek') {
    newData.deadline = new Date()
    newData.deadline.setDate(
      newData.deadline.getDate() + (workday - newData.deadline.getDay())
    )
  } else if (value === 'next') {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    newData.deadline = tomorrow
  }
  return newData
}
