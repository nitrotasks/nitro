import { get, set } from 'idb-keyval'
import Events from '../events.js'
import List from '../models/listModel.js'
import { createId } from '../helpers/random.js'
import { broadcast } from '../sync/broadcastchannel.js'

// the main thing that holds all the lists
export class lists extends Events {
  constructor(props) {
    super(props)
    this.order = []
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
    if (this.order.indexOf(id) === -1) {
      this.order.push(id)
    }
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
    this.order.splice(this.order.indexOf(id), 1)
    this.trigger('update')
    this.saveLocal()
  }
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
  all() {
    return this.collection
  }
  updateOrder(order) {
    const specialLists = ['inbox', 'today', 'next', 'all']
    const withoutSpecialLists = order.filter(i => !specialLists.includes(i))
    const newOrder = specialLists.concat(withoutSpecialLists)

    if (newOrder.length !== this.order.length) {
      return
    }

    this.order = newOrder
    this.trigger('lists-order')
  }
  escape(name) {
    if (name === 'nitrosys-inbox') {
      return 'Inbox'
    }
    return name
  }
  saveLocal() {
    set('lists', this.toObject()).then(broadcast.db)
  }
  loadLocal() {
    return get('lists').then(data => {
      this.collection = new Map()
      if (typeof data === 'undefined') {
        this.createLocal()
        this.saveLocal()
        return
      }
      data.forEach(item => {
        this.order.push(item.id)
        this.collection.set(item.id, new List(item))
      })
    })
  }
  createLocal() {
    this.collection.set(
      'inbox',
      new List({
        id: 'inbox',
        name: 'nitrosys-inbox',
        virtual: false
      })
    )
    this.order.push('inbox')
    this.collection.set(
      'today',
      new List({
        id: 'today',
        name: 'Today',
        virtual: true
      })
    )
    this.order.push('today')
    this.collection.set(
      'next',
      new List({
        id: 'next',
        name: 'Next',
        virtual: true
      })
    )
    this.order.push('next')

    // I think we'll leave this out for the initial release
    // this.collection.set(
    //   'all',
    //   new List({
    //     id: 'all',
    //     name: 'Everything',
    //     virtual: true
    //   })
    // )
    // this.order.push('all')
  }
  toObject() {
    return this.order.map(listId => {
      return this.find(listId).toObject()
    })
  }
}
export let ListsCollection = new lists()
