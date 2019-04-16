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

export function getList(listId, groupedByHeaders = false) {
  const ret = ListsCollection.find(listId)
    .localOrder.reduce((a, b) => a.concat(b), [])
    .map(t => {
      const task = TasksCollection.find(t)
      if (task === null) return null
      const taskObj = task.toObject()
      return taskObj
    })

  if (groupedByHeaders) {
    const grouped = ret
      .filter(a => a !== null)
      .reduce((a, b) => {
        if (a.length === 0) {
          return [[b]]
        } else if (b.type !== 'header' && b.type !== 'header-collapsed') {
          a[0].push(b)
          return a
        } else {
          return [[b]].concat(a)
        }
      }, [])
    return grouped.reverse()
  }

  return findHeaders(ret)
}
