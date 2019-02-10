// @flow
import { TasksCollection } from './tasksCollection.js'
import { ListsCollection } from './listsCollection.js'

export function findHeaders(tasks: Array<Object>): Array<Object> {
  const lists = {}
  tasks.forEach(task => {
    if (!(task.list in lists)) {
      lists[task.list] = []
    }
    return lists[task.list].push(task.id)
  })
  // traverses order to find headings
  const headings = {}
  Object.keys(lists).forEach(list => {
    let currentHeading = null
    ListsCollection.find(list).localOrder.forEach(task => {
      const currentTask = TasksCollection.find(task)
      if (currentTask === null) {
        return
      }
      if (
        currentTask.type === 'header' ||
        currentTask.type === 'header-collapsed'
      ) {
        currentHeading = currentTask.name
      } else if (lists[list].indexOf(task) > -1) {
        headings[task] = currentHeading
      }
    })
  })

  return tasks.map(task => {
    task.heading = headings[task.id]
    return task
  })
}
