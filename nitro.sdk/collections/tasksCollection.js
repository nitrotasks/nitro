import { get, set } from 'idb-keyval'
import Events from '../events.js'
import Task from '../models/taskModel.js'
import { getToday, getNext } from './magicListCollection.js'
import {
  getAlphabetical,
  getPriority,
  getDate,
  getDeadline
} from './sortedListCollection.js'
import { createId } from '../helpers/random.js'
import { broadcast } from '../sync/broadcastchannel.js'
import { log } from '../helpers/logger.js'

// the main thing that holds all the tasks
export class tasks extends Events {
  constructor(props) {
    super(props)
    this.collection = new Map()
  }
  setSync(sync) {
    this.sync = sync
  }
  all() {
    return this.collection
  }
  add(props) {
    const id = createId(this.find.bind(this))
    props.id = id
    this.collection.set(id, new Task(props))

    this.trigger('update', props.list)
    this.saveLocal()

    this.sync.addToQueue([props.list, id], 'post', 'tasks')
    return id
  }
  addBatch(tasks) {
    const created = []
    tasks.forEach(props => {
      const id = createId(this.find.bind(this))
      props.id = id
      this.collection.set(id, new Task(props))

      // not the right place for this
      this.sync.queueLock.push([[props.list, id], 'post', 'tasks'])
      created.push(id)
    })
    this.trigger('update', tasks[0].list)
    this.saveLocal()

    this.sync.trigger('queue-lock')
    this.sync.saveQueue().then(this.processQueue)
    return created
  }
  update(id, props, sync = true) {
    const resource = this.find(id, !sync)
    if (resource === null) {
      return null
    }

    // not allowed to update the id
    resource.clientUpdate = new Date()
    Object.keys(props).forEach(function(key) {
      if (key !== 'id') resource[key] = props[key]
    })
    this.trigger('update', resource.list, id)
    this.saveLocal()
    if (sync) this.sync.addToQueue([resource.list, id], 'patch', 'tasks')
    return resource
  }
  delete(id, local = false) {
    if (local === true) {
      return this.actualDelete(id)
    }
    const resource = this.find(id)
    this.sync.addToQueue([resource.list, id], 'delete', 'tasks')
  }
  actualDelete(id) {
    this.collection.delete(id)
    this.trigger('update')
    this.saveLocal()
  }
  archiveMultiple(taskIds, listId, listName, signedIn = false, headers = null) {
    return new Promise(resolve => {
      const archiveDelete = []
      const archiveId = []
      const archiveData = []
      taskIds.forEach(task => {
        const resource = this.find(task)
        if (resource === null) return
        archiveDelete.push(task)
        if (resource.serverId === null && signedIn === true) return
        resource.type = 'archived'
        archiveId.push(resource.serverId)
        const obj = resource.toObject()
        obj.list = listName
        if (headers !== null) {
          obj.header = headers[task]
        }
        archiveData.push(obj)
      })

      if (signedIn && archiveId.length > 0) {
        this.sync.addToQueue([listId, archiveId], 'archive', 'tasks')
      }

      const key = 'archive-' + listId
      get(key).then(data => {
        if (typeof data === 'undefined') {
          set(key, archiveData).then(cb)
        } else {
          data = data.concat(archiveData)
          set(key, data).then(cb)
        }
      })

      const cb = () => {
        // only delete stuff straight away if they don't have an account
        // otherwise, on sync it'll get deleted anyway
        if (!signedIn) {
          archiveDelete.forEach(id => {
            this.collection.delete(id)
          })
        }

        this.trigger('update')
        this.saveLocal()
        resolve(archiveDelete)
      }
    })
  }
  // maybe roll these into one function?
  addListFromServer(tasks, listId) {
    if (tasks.length < 1) return
    tasks.forEach(props => {
      const id = createId(this.find.bind(this))
      props.serverId = props.id
      props.lastSync = props.updatedAt
      props.id = id
      props.list = listId
      this.collection.set(id, new Task(props))
    })
    this.trigger('update', listId)
    this.saveLocal()
  }
  patchListFromServer(tasks, listId) {
    const findFromServer = function(serverId) {
      return function(item) {
        return item.serverId === serverId
      }
    }
    if (tasks.length < 1) return
    const currentTasks = this.findList(listId, true)
    tasks.forEach(props => {
      const task = currentTasks.find(findFromServer(props.id))

      // prevents update if race conditions
      if (new Date(props.updatedAt) < task.clientUpdate) {
        log('tasks', `Newer on client - not updating ${props.id}`)
        return
      }
      // prevents update if there's another pending item in the next queue
      if (this.sync.queueLock.filter(i => i[0][1] === task.id).length > 0) {
        log('tasks', `Pending item in next queue - not updating ${props.id}`)
        return
      }

      task.lastSync = props.updatedAt

      Object.keys(props).forEach(prop => {
        if (prop === 'date' || prop === 'deadline' || prop === 'completed') {
          if (props[prop] !== null) {
            task[prop] = new Date(props[prop])
          } else {
            task[prop] = props[prop]
          }
        } else if (prop !== 'id') {
          task[prop] = props[prop]
        }
      })
    })
    this.trigger('update', listId)
    this.saveLocal()
  }
  // this might be enhanced in the future to get task from server?
  find(id, serverId = false) {
    // ugh there's no find() method :|
    // or reduce method
    if (serverId) {
      let match = null
      this.collection.forEach(item => {
        if (item.serverId === id) {
          match = item
        }
      })
      return match
    }
    return this.collection.get(id) || null
  }
  findList(list, models = false) {
    let returned = []
    if (list === 'all') {
      // return all tasks, ignore ids
      returned = Array.from(this.collection, function(item) {
        return item[1]
      })
    } else {
      if (list === 'today') {
        returned = getToday()
      } else if (list === 'next') {
        returned = getNext()
      } else {
        // return the normal list
        this.collection.forEach(function(task) {
          if (task.list === list) {
            returned.push(models ? task : task.toObject())
          }
        })
      }
    }
    return returned
  }
  findListSorted(list, algorithm) {
    if (algorithm === 'alphabetical') {
      return getAlphabetical(list, false)
    } else if (algorithm === 'alphabetical-ignoreheaders') {
      return getAlphabetical(list, true)
    } else if (algorithm === 'priority') {
      return getPriority(list, false)
    } else if (algorithm === 'priority-ignoreheaders') {
      return getPriority(list, true)
    } else if (algorithm === 'date') {
      return getDate(list, false)
    } else if (algorithm === 'date-ignoreheaders') {
      return getDate(list, true)
    } else if (algorithm === 'deadline') {
      return getDeadline(list, false)
    } else if (algorithm === 'deadline-ignoreheaders') {
      return getDeadline(list, true)
    }
  }
  mapToLocal(list) {
    return list.map(item => {
      return this.find(item, true).id
    })
  }
  findListCount(list) {
    return this.findList(list).filter(task => {
      return (
        task.type !== 'header' &&
        task.type !== 'header-collapsed' &&
        task.type !== 'archived' &&
        task.completed === null
      )
    }).length
  }
  deleteTasks(tasks) {
    this.collection.forEach((task, key) => {
      if (tasks.indexOf(task.id) !== -1) {
        this.collection.delete(key)
      }
    })
    this.saveLocal()
  }
  deleteAllFromList(list, queueItem = true) {
    this.collection.forEach((task, key) => {
      if (task.list === list) {
        if (task.serverId === null && queueItem === true) {
          this.sync.addToQueue([task.list, key], 'delete', 'tasks')
        }
        this.collection.delete(key)
      }
    })
    this.saveLocal()
  }
  saveLocal() {
    set('tasks', this.toObject()).then(broadcast.db)
  }
  loadLocal() {
    return get('tasks').then(data => {
      this.collection = new Map()
      if (typeof data === 'undefined') {
        this.saveLocal()
        return
      }
      data.forEach(item => {
        this.collection.set(item.id, new Task(item))
      })
    })
  }
  toObject() {
    let result = []
    this.collection.forEach(value => {
      result.push(value.toObject())
    })
    return result
  }
}
export let TasksCollection = new tasks()
