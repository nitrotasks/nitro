// @flow
import { TasksCollection } from './tasksCollection.js'
import { ListsCollection } from './listsCollection.js'

// this is how many items to split out
const groupSize = 2

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
const completedCheck = function(date: Date): boolean {
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
  if (task.type === 'archived') {
    priority += 10000000
  }
  if (task.date === null && task.deadline === null) {
    if (task.type === 'next') {
      priority += 10020 + 15 * 20
    } else {
      priority += 100000
    }
  }
  // overdue
  if (task.deadline !== null && task.deadline < new Date()) {
    // 15 points per date overdue
    priority += 1000 + penalty(task.deadline) * 15

    if (task.date !== null) {
      priority += 15 + penalty(task.date)
    } else {
      if (task.type === 'next') {
        priority += 15 * 10
      } else {
        priority += 30
      }
    }
  } else if (
    task.date !== null &&
    task.type !== 'next' &&
    task.date < new Date()
  ) {
    // 8 points per date overdue, up to two weeks of course.
    // slightly less weight than deadlines
    priority += 1030 + penalty(task.date) * 8

    // about a week more weight if there's a deadline
    if (task.deadline) {
      priority += 8 * -7
    }

    /* TODAY CUTOFF */
  } else if (task.deadline !== null && task.deadline > new Date()) {
    priority += 10000 + penalty(task.deadline) * 5
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
    priority += 10020 + penalty(task.date) * 20
  }
  return priority
}
function findHeaders(tasks: Array<Object>): Array<Object> {
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
function groupList(list: Array<Object>, group: string): Array<Object> {
  const deadlines = []
  const listCount = {}
  const other = list
    .map(item => {
      if (item.deadline && item.deadline < new Date()) {
        deadlines.push(item)
        item.dead = true
      } else {
        // this builds a list of how many tasks are in each list and heading
        if (!(item.list in listCount)) {
          listCount[item.list] = {
            length: 0,
            lengthNoHeadings: 0,
            headings: {}
          }
        }
        listCount[item.list].length++
        if (item.heading === null) {
          listCount[item.list].lengthNoHeadings++
        } else {
          if (!(item.heading in listCount[item.list].headings)) {
            listCount[item.list].headings[item.heading] = 0
          }
          listCount[item.list].headings[item.heading]++
        }
      }
      return item
    })
    .filter(item => item.dead !== true)

  const headingsToMake = []
  Object.keys(listCount).forEach(key => {
    if (listCount[key].length >= groupSize && key !== 'inbox') {
      let rootCount = listCount[key].lengthNoHeadings
      Object.keys(listCount[key].headings).forEach(heading => {
        if (listCount[key].headings[heading] >= groupSize) {
          headingsToMake.push([key, heading].join('-'))
        } else {
          rootCount += listCount[key].headings[heading]
        }
      })
      if (rootCount > 0) {
        headingsToMake.push(key)
      }
    }
  })

  // Now another pass, to turn the defined headings into real headings
  const groupingsOrder = ['today']
  const groupings = {
    today: [],
    next: []
  }
  if (group === 'next') {
    groupingsOrder.push('next')
  }
  other.forEach(task => {
    const taskHeader = [task.list, task.heading].join('-')
    if (headingsToMake.indexOf(taskHeader) > -1) {
      // always insert the root list as the first heading
      if (
        groupingsOrder.indexOf(task.list) === -1 &&
        headingsToMake.indexOf(task.list) > -1
      ) {
        groupingsOrder.push(task.list)
        groupings[task.list] = []
      }
      if (groupingsOrder.indexOf(taskHeader) === -1) {
        groupingsOrder.push(taskHeader)
        groupings[taskHeader] = []
      }
      groupings[taskHeader].push(task)
    } else if (headingsToMake.indexOf(task.list) > -1) {
      if (groupingsOrder.indexOf(task.list) === -1) {
        groupingsOrder.push(task.list)
        groupings[task.list] = []
      }
      groupings[task.list].push(task)
    } else {
      if (group === 'next' && task.magicPriority > 10000) {
        groupings.next.push(task)
      } else {
        groupings.today.push(task)
      }
    }
  })

  // Final Pass, this time creating headings and making groups into one
  let final = []
  groupingsOrder.forEach(group => {
    let name = group
    if (group === 'today') {
      name = 'Today'
    } else {
      const split = group.split('-')
      const headerName = [ListsCollection.find(split[0]).name]
      if (split.length > 1) {
        headerName.push(split.slice(1).join('-'))
      }
      name = headerName.join(' — ')
    }
    // ensures that the today and next headings don't randombly show up
    if (
      (groupingsOrder.length > 1 || deadlines.length > 0) &&
      groupings[group].length > 0
    ) {
      final.push({
        id: group,
        type: 'header',
        name: name
      })
    }
    final = final.concat(groupings[group])
  })

  if (deadlines.length > 0) {
    deadlines.unshift({
      id: 'overdue',
      type: 'header',
      name: 'Overdue'
    })
    final = deadlines.concat(final)
  }
  return final
}
function getList(
  threshold: number,
  comparison: string,
  group?: string
): Array<Object> {
  const ret = ListsCollection.order
    .map(listId => {
      const list = ListsCollection.find(listId)
      return list ? list.toObject() : { virtual: true }
    })
    .filter(l => !l.virtual)
    .map(l => l.localOrder)
    .reduce((a, b) => a.concat(b), [])
    .map(t => {
      const task = TasksCollection.find(t)
      if (task === null) return null
      const taskObj = task.toObject()
      taskObj.magicPriority = getPriority(taskObj)
      return taskObj
    })
    .filter(task => {
      if (task === null) return false
      if (task.type === 'header' || task.type === 'header-collapsed') {
        return false
      }
      if (comparison === 'gt' && task.magicPriority >= threshold) {
        return true
      } else if (comparison === 'lt' && task.magicPriority < threshold) {
        return true
      }
      return false
    })
    .sort((a, b) => a.magicPriority - b.magicPriority)
  if (group) {
    return groupList(findHeaders(ret), group)
  }
  return findHeaders(ret)
}

export function getToday(group: boolean = true): Array<Object> {
  return getList(10000, 'lt', group ? 'today' : undefined)
}
export function getNext(group: boolean = true): Array<Object> {
  return getList(100000, 'lt', group ? 'next' : undefined)
}
