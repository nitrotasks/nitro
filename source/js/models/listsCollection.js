import db from 'idb-keyval'
import Events from './events.js'
import List from './list.js'

// the main thing that holds all the lists
export class lists extends Events {
  constructor(props) {
    super(props)
    this.collection = new Map()
  }
  setSync(sync) {
    this.sync = sync
  }
  add(props, sync = true) {
    // TODO: collision detection
    let id = Math.round(Math.random()*100000).toString()
    if (props.name === 'nitrosys-inbox') {
      id = 'inbox'
    }
    props.id = id

    const newList = new List(props)
    this.collection.set(id, newList)
    this.trigger('update')
    this.saveLocal()
    if (sync) this.sync.addToQueue(id, 'post')
    return newList
  }
  update(id, props, sync = true) {
    // finds by serverId if not sync mode
    const resource = this.find(id, !sync)
    // not allowed to update the id or tasks
    Object.keys(props).forEach(function(key) {
      if (key !== 'id' && key !== 'tasks') resource[key] = props[key] 
    })
    this.trigger('update')
    this.saveLocal()
    if (sync) this.sync.addToQueue(id, 'patch')
    return resource
  }
  delete(id, queueItem = true) {
    if (queueItem) {
      this.sync.addToQueue(id, 'delete')
    }
    this.collection.delete(id)
    this.trigger('update')
    this.saveLocal()
  }
  find(id, serverId = false) {
    // ugh there's no find() method :|
    // or reduce method
    if (serverId) {
      let match = null
      this.collection.forEach((item) => {
        if (item.serverId === id) {
          match = item
        }
      })
      return match
    }
    return this.collection.get(id) || null
  }
  all() {
    return this.collection
  }
  escape(name) {
    if (name === 'nitrosys-inbox') {
      return 'Inbox'
    }
    return name
  }
  saveLocal() {
    db.set('lists', this.toObject())
  }
  loadLocal() {
    return db.get('lists').then(data => {
      if (typeof data === 'undefined') {
        this.createLocal()
        this.saveLocal()
        return
      }
      data.forEach((item) => {
        this.collection.set(item.id, new List(item))
      })
    })
  }
  createLocal() {
    this.collection.set('inbox', new List({
      id: 'inbox',
      name: 'nitrosys-inbox'
    }))
    this.collection.set('today', new List({
      id: 'today',
      name: 'Today'
    }))
    this.collection.set('next', new List({
      id: 'next',
      name: 'Next'
    }))
    this.collection.set('all', new List({
      id: 'all',
      name: 'Everything'
    }))
  }
  toObject() {
    // TODO: when this is patched to have an order
    // update this to use these in order
    let result = []
    this.collection.forEach(function(value, key) {
      result.push(value.toObject())
    })
    return result
  }
}
export let ListsCollection = new lists()