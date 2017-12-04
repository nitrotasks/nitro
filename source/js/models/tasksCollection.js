import db from 'idb-keyval'
import Events from './events.js'
import Task from './task.js'
import { getToday, getNext } from './magicList.js'

// the main thing that holds all the tasks
export class tasks extends Events {
  constructor(props) {
    super(props)
    // two stores, one for current tasks, one for completed
    this.collection = new Map()
    this.completedcollection = new Map()
  }
  setSync(sync) {
    this.sync = sync
  }
  add(props) {
    // todo: collision detection
    let id = Math.round(Math.random() * 100000).toString()
    props.id = id
    this.collection.set(id, new Task(props))

    this.trigger('update', props.list)
    this.saveLocal()

    this.sync.post([props.list, id])
    return id
  }
  update(id, props, sync = true) {
    const resource = this.find(id, !sync)
    if (resource === null) {
      return null
    }

    // not allowed to update the id
    Object.keys(props).forEach(function(key) {
      if (key !== 'id') resource[key] = props[key]
    })
    this.trigger('update')
    this.trigger('updateTask', id)
    this.saveLocal()
    if (sync) this.sync.patch([resource.list, id])
    return resource
  }
  delete(id) {
    const resource = this.find(id)
    this.sync.delete([resource.list, id])
    this.collection.delete(id)
    this.trigger('update')
    this.saveLocal()
  }
  archive(id, signedIn = false) {
    // this is extra safe
    return new Promise((resolve, reject) => {
      const resource = this.find(id)
      if (signedIn) {
        this.sync.archive([resource.list, resource.serverId])
      }

      const cb = () => {
        this.collection.delete(id)

        this.trigger('update')
        this.saveLocal()
        resolve()
      }
      
      const key = 'archive-' + resource.list
      db.get(key).then(data => {
        if (typeof data === 'undefined') {
          db.set(key, [resource.toObject()]).then(cb)
        } else {
          data.push(resource.toObject())
          db.set(key, data).then(cb)
        }
      })
    })
  }
  // maybe roll these into one function?
  addListFromServer(tasks, listId) {
    if (tasks.length < 1) return
    tasks.forEach(props => {
      // todo: collision detection
      let id = Math.round(Math.random() * 100000).toString()
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
      Object.keys(props).forEach(prop => {
        if (prop === 'date' || prop === 'deadline' || prop === 'completed') {
          if (props[prop] !== null) {
            task[prop] = new Date(props[prop])
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
    return this.findList(list).filter(task => task.type !== 'header' && task.completed === null).length
  }
  deleteTasks(tasks) {
    this.collection.forEach((task, key) => {
      if (tasks.indexOf(task.id) !== -1) {
        this.collection.delete(key)
      }
    })
    this.saveLocal()
  }
  deleteAllFromList(list) {
    this.collection.forEach((task, key) => {
      if (task.list === list) {
        if (task.serverId === null) {
          this.sync.delete([task.list, key])
        }
        this.collection.delete(key)
      }
    })
    this.saveLocal()
  }
  saveLocal() {
    db.set('tasks', this.toObject())
  }
  loadLocal() {
    return db.get('tasks').then(data => {
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