export const dateValue = function(value) {
  const newData = {}
  if (value.constructor === Date) {
    newData.type = 'task'
    newData.date = value
  } else if (value === 'today') {
    newData.type = 'next'
    newData.date = new Date()
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