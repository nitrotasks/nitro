const dayms = 1000 * 60 * 60 * 24

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
  if (typeof showToday !== 'string' && showToday < new Date()) {
    return 'Overdue'
  } else if (showToday === 'today' && date < new Date()) {
    return 'Today'
  } else if (showToday !== 'no') {
    const days = Math.ceil((date.getTime() - new Date().getTime()) / dayms)
    if (days === 1) {
      return 'Tomorrow'
    } else if (days > 0 && days < 7) {
      return date.toLocaleDateString(navigator.language, {weekday: 'long'})
    }
  }

  return date.toLocaleDateString(navigator.language, {month: 'short', day: 'numeric'})
}

export const dateValue = function(value) {
  const newData = {}
  if (value.constructor === Date) {
    newData.type = 'task'
    newData.date = value
  } else if (value === 'today') {
    newData.type = 'task'
    newData.date = new Date()
    newData.date.setSeconds(newData.date.getSeconds()-1)
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
  if (value.constructor === Date) {
    newData.deadline = value
  } else if (value === 'today') {
    newData.deadline = new Date()
  } else if (value === 'next') {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1)
    newData.deadline = tomorrow
  }
  return newData
}