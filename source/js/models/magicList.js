// @flow
import { TasksCollection } from './tasksCollection.js'

// two weeks is sort of the limit here
const penalty = function(date: Date): number {
  const diff = Math.round((date.getTime() - new Date().getTime()) / 86400000)
  if (diff > 14) {
    return 14
  } else if (diff < -14) {
    return -14
  }
  return diff
}

// 3am cutoff
const completedCheck = function(date: Date): bool {
  const yesterday = new Date()
  if (yesterday.getHours() <= 3) {
    yesterday.setDate(yesterday.getDate() - 1)
  }
  yesterday.setHours(3)
  return date < yesterday
}

const getPriority = function(task: Object): number {
  let priority = 0
  if (task.completed !== null && completedCheck(task.completed)) {
    priority += 1000000
  }
  if (task.date === null && task.deadline === null) {
    if (task.type === 'next') {
      priority += 10020 + (15 * 20)
    } else {
      priority += 100000
    }
  }
  // overdue
  if (task.deadline !== null && task.deadline < new Date()) {
    // 15 points per date overdue
    priority += 1000 + (penalty(task.deadline) * 15)

    if (task.date !== null) {
      priority += 15 + penalty(task.date)
    } else {
      if (task.type === 'next') {
        priority += 15 * 10
      } else {
        priority += 30
      }
    }

  } else if (task.date !== null && task.type !== 'next' && task.date < new Date()) {
    // 8 points per date overdue, up to two weeks of course.
    // slightly less weight than deadlines
    priority += 1000 + (penalty(task.date) * 8)

    // about a week more weight if there's a deadline
    if (task.deadline) {
      priority += (8 * -7)
    }

  /* TODAY CUTOFF */
  } else if (task.deadline !== null && task.deadline > new Date()) {
    priority += 10000 + (penalty(task.deadline) * 5)
    // ones with dates are more important than those without
    if (task.date === null) {
      if (task.type === 'next') {
        priority += 15 * 10
      } else {
        priority += 30
      }
    } else {
      priority += penalty(task.date) * 10
    }
  } else if (task.date !== null) {
    // slightly less important if there's no due date
    priority += 10020 + (penalty(task.date) * 20)
  }
  return priority
}

function getList(threshold: number, comparison: string): Array<Object> {
  const ret = Array.from(TasksCollection.collection, function(item) {
    const task = item[1].toObject()
    task.priority = getPriority(task)
    return task
  }).filter(task => {
    if (comparison === 'gt' && task.priority >= threshold) {
      return true
    } else if (comparison === 'lt' && task.priority < threshold) {
      return true
    }
    return false
  }).sort((a,b) => {
    return a.priority - b.priority
  })
  return ret
}

export function getToday(): Array<Object> {
  return getList(10000, 'lt')
}
export function getNext(): Array<Object> {
  return getList(100000, 'lt') 
}
