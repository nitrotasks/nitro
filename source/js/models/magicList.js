// @flow
import { TasksCollection } from './tasksCollection.js'

function getPriority(task: Object): number {
  let priority = 0
  if (task.completed !== null) {
    priority += 100000
  }
  if (task.date === null && task.deadline === null) {
    priority += 10000
  }
  return priority
}

export function getToday(): Array<Object> {
  const ret = Array.from(TasksCollection.collection, function(item) {
    const task = item[1].toObject()
    task.priority = getPriority(task)
    return task
  }).filter((task) => {
    if (task.priority < 1000) {
      return true
    }
    return false
  })
  return ret
}