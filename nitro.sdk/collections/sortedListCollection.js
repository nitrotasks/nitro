// @flow
import { TasksCollection } from './tasksCollection.js'
import { ListsCollection } from './listsCollection.js'

import { findHeaders } from './helpersListCollection.js'

function getList(listId, groupedByHeaders = false) {
  const ret = ListsCollection.find(listId)
    .localOrder.reduce((a, b) => a.concat(b), [])
    .map(t => {
      const task = TasksCollection.find(t)
      if (task === null) return null
      const taskObj = task.toObject()
      return taskObj
    })

  if (groupedByHeaders) {
    const grouped = ret.reduce((a, b) => {
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

export function getAlphabetical(
  listId: string,
  ignoreHeaders: boolean = false
): Array<Object> {
  const tasks = getList(listId, !ignoreHeaders)
  if (ignoreHeaders) {
    return tasks
      .filter(t => t.type !== 'header' && t.type !== 'header-collapsed')
      .sort((a, b) => a.name.localeCompare(b.name))
  }

  return tasks
    .map(t =>
      t.sort((a, b) => {
        if (a.type === 'header' || a.type === 'header-collapsed') return 0
        return a.name.localeCompare(b.name)
      })
    )
    .reduce((a, b) => a.concat(b))
}

export function getPriority(
  listId: string,
  ignoreHeaders: boolean = false
): Array<Object> {
  const tasks = getList(listId, !ignoreHeaders)
  if (ignoreHeaders) {
    return tasks
      .filter(t => t.type !== 'header' && t.type !== 'header-collapsed')
      .sort((a, b) => {
        const priority = b.priority - a.priority
        if (priority === 0) return a.name.localeCompare(b.name)
        return priority
      })
  }

  return tasks
    .map(t =>
      t.sort((a, b) => {
        if (a.type === 'header' || a.type === 'header-collapsed') return 0
        const priority = b.priority - a.priority
        if (priority === 0) return a.name.localeCompare(b.name)
        return priority
      })
    )
    .reduce((a, b) => a.concat(b))
}

export function getDate(
  listId: string,
  ignoreHeaders: boolean = false
): Array<Object> {
  const tasks = getList(listId, !ignoreHeaders)
  if (ignoreHeaders) {
    return tasks
      .filter(t => t.type !== 'header' && t.type !== 'header-collapsed')
      .sort((a, b) => {
        const date =
          (a.date || Infinity) - (b.date || Infinity) ||
          (a.deadline || Infinity) - (b.deadline || Infinity)
        if (date === 0 || isNaN(date)) return a.name.localeCompare(b.name)
        return date
      })
  }

  return tasks
    .map(t =>
      t.sort((a, b) => {
        if (a.type === 'header' || a.type === 'header-collapsed') return 0
        const date =
          (a.date || Infinity) - (b.date || Infinity) ||
          (a.deadline || Infinity) - (b.deadline || Infinity)
        if (date === 0 || isNaN(date)) return a.name.localeCompare(b.name)
        return date
      })
    )
    .reduce((a, b) => a.concat(b))
}

export function getDeadline(
  listId: string,
  ignoreHeaders: boolean = false
): Array<Object> {
  const tasks = getList(listId, !ignoreHeaders)
  if (ignoreHeaders) {
    return tasks
      .filter(t => t.type !== 'header' && t.type !== 'header-collapsed')
      .sort((a, b) => {
        const deadline =
          (a.deadline || Infinity) - (b.deadline || Infinity) ||
          (a.date || Infinity) - (b.date || Infinity)
        if (deadline === 0 || isNaN(deadline))
          return a.name.localeCompare(b.name)
        return deadline
      })
  }

  return tasks
    .map(t =>
      t.sort((a, b) => {
        if (a.type === 'header' || a.type === 'header-collapsed') return 0
        const deadline =
          (a.deadline || Infinity) - (b.deadline || Infinity) ||
          (a.date || Infinity) - (b.date || Infinity)
        if (deadline === 0 || isNaN(deadline))
          return a.name.localeCompare(b.name)
        return deadline
      })
    )
    .reduce((a, b) => a.concat(b))
}
