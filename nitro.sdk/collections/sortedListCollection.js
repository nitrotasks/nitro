// @flow
import { getList } from './helpersListCollection.js'

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
