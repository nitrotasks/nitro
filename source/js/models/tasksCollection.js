import db from 'idb-keyval'
import Events from './events.js'
import Task from './task.js'
import { getToday, getNext } from './magicList.js'
import { createId } from '../helpers/random.js'
import { broadcast } from '../stores/broadcastchannel.js'

// the main thing that holds all the tasks
export class tasks extends Events {
  constructor(props) {
    super(props)
    this.collection = new Map()
  }
  setSync(sync) {
    this.sync = sync
  }
  add(props) {
    const id = createId(this.find.bind(this))
    props.id = id
    this.collection.set(id, new Task(props))

    this.trigger('update', props.list)
    this.saveLocal()

    this.sync.addToQueue([props.list, id], 'post')
    return id
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
    this.trigger('update')
    this.trigger('updateTask', id)
    this.saveLocal()
    if (sync) this.sync.addToQueue([resource.list, id], 'patch')
    return resource
  }
  delete(id) {
    const resource = this.find(id)
    this.sync.addToQueue([resource.list, id], 'delete')
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
        this.sync.addToQueue([listId, archiveId], 'archive')
      }

      const key = 'archive-' + listId
      db.get(key).then(data => {
        if (typeof data === 'undefined') {
          db.set(key, archiveData).then(cb)
        } else {
          data = data.concat(archiveData)
          db.set(key, data).then(cb)
        }
      })

      const cb = () => {
        // only delete stuff straight away if they don't have an account
        // otherwise, on sync it'll get deleted anyway
        if (!signedIn) {
          archiveDelete.forEach((id) => {
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
      this.trigger('updateTask', task.id)
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
  mapToLocal(list) {
    return list.map(item => {
      return this.find(item, true).id
    })
  }
  findListCount(list) {
    return this.findList(list).filter(task => {
      return (task.type !== 'header' && task.type !== 'archived' && task.completed === null)
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
          this.sync.addToQueue([task.list, key], 'delete')
        }
        this.collection.delete(key)
      }
    })
    this.saveLocal()
  }
  saveLocal() {
    db.set('tasks', this.toObject()).then(broadcast.db)
  }
  loadLocal() {
    return db.get('tasks').then(data => {
      this.collection = new Map()
      if (typeof data === 'undefined') {
        this.createLocal()
        this.saveLocal()
        return
      }
      data.forEach((item) => {
        this.collection.set(item.id, new Task(item))
      })
    })
  }
  createLocal() {
    console.log('TODO: Create Default Tasks')
  }
  toObject() {
    let result = []
    this.collection.forEach(function(value, key) {
      result.push(value.toObject())
    })
    return result
  }
}
export let TasksCollection = new tasks()