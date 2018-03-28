import db from 'idb-keyval'
import Events from '../events.js'
import List from '../models/listModel.js'
import { createId } from '../helpers/random.js'
import { broadcast } from '../sync/broadcastchannel.js'

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
    let id = createId(this.find.bind(this))
    if (props.name === 'nitrosys-inbox') {
      id = 'inbox'
    }
    props.id = id

    const newList = new List(props)
    this.collection.set(id, newList)
    this.trigger('update')
    this.saveLocal()
    if (sync) this.sync.addToQueue(id, 'post', 'lists')
    return newList
  }
  update(id, props, sync = true) {
    // finds by serverId if not sync mode
    const resource = this.find(id, !sync)
    // not allowed to update the id or tasks
    resource.clientUpdate = new Date()
    Object.keys(props).forEach(function(key) {
      if (key !== 'id' && key !== 'tasks') resource[key] = props[key] 
    })
    this.trigger('update')
    this.saveLocal()
    if (sync) this.sync.addToQueue(id, 'patch', 'lists')
    return resource
  }
  delete(id, local = false) {
    if (local === true) {
      return this.actualDelete(id)
    }
    this.sync.addToQueue(id, 'delete', 'lists')
  }
  actualDelete(id) {
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
    db.set('lists', this.toObject()).then(broadcast.db)
  }
  loadLocal() {
    return db.get('lists').then(data => {
      this.collection = new Map()
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
    this.collection.forEach(function(value) {
      result.push(value.toObject())
    })
    return result
  }
}
export let ListsCollection = new lists()