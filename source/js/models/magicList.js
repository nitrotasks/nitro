// @flow
import { TasksCollection } from './tasksCollection.js'

// two weeks is sort of the limit here
const penalty = function(date: Date | string): number {
  if (typeof date === 'string') {
    return 15
  }
  const diff = Math.round((date.getTime() - new Date().getTime()) / 86400000)
  if (diff > 14) {
    return 14
  } else if (diff < -14) {
    return -14
  }
  return diff
}

const getPriority = function(task: Object): number {
  let priority = 0
  if (task.completed !== null) {
    priority += 100000
  }
  if (task.date === null && task.deadline === null) {
    priority += 10000
  }
  // overdue
  if (task.deadline !== null && task.deadline < new Date()) {
    // 15 points per date overdue
    priority += 1000 + (penalty(task.deadline) * 15)

    if (task.date !== null) {
      priority += 15 + penalty(task.date) * 1
    } else {
      priority += 30
    }

  } else if (task.date !== null && typeof task.date !== 'string' && task.date < new Date()) {
    // 8 points per date overdue, up to two weeks of course.
    // slightly less weight than deadlines
    priority += 1000 + (penalty(task.date) * 8)

    // about a week more weight if there's a deadline
    if (task.deadline) {
      priority += (8 * -7)
    }

  /* TODAY CUTOFF */
  } else if (task.deadline !== null && task.deadline > new Date()) {
    priority += 10000
    // priority += 500 + penalty(task.date) * 10
  } else if (task.date !== null) {
    priority += 10000
    // do something else
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
