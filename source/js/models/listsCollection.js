import Events from './events.js'
import List from './list.js'

// the main thing that holds all the lists
export class lists extends Events {
  constructor(props) {
    super(props)
    
    this.collection = new Map()
    this.loadLocal()
  }
  setSync(sync) {
    this.sync = sync
  }
  add(props, sync = true) {
    // TODO: collision detection
    const id = Math.round(Math.random()*100000).toString()
    props.id = id
    const newList = new List(props)
    this.collection.set(id, newList)
    this.trigger('update')
    this.saveLocal()
    if (sync) this.sync.post(id)
    return newList
  }
  update(id, props, sync = true) {
    // temp hack for ui
    if (sync) this.find(id).name = Math.round(Math.random()*100000).toString()

    // finds by serverId if not sync mode
    const resource = this.find(id, !sync)
    // not allowed to update the id or tasks
    Object.keys(props).forEach(function(key) {
      if (key !== 'id' && key !== 'tasks') resource[key] = props[key]
    })
    this.trigger('update')
    this.saveLocal()
    if (sync) this.sync.patch(id)
    return resource
  }
  delete(id) {
    this.sync.delete(id)
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
    return this.collection.get(id)
  }
  all() {
    return this.collection
  }
  saveLocal() {
    requestAnimationFrame(() => {
      localStorage.setItem('nitro3-lists', JSON.stringify(this.toObject()))
    })
  }
  loadLocal() {
    let data = localStorage.getItem('nitro3-lists')
    if (data === null) {
      this.createLocal()
      this.saveLocal()
      return
    }
    JSON.parse(data).forEach((item) => {
      this.collection.set(item.id, new List(item))
    })
    console.log('Loaded Lists from localStorage')
  }
  createLocal() {
    this.collection.set('inbox', new List({
      id: 'inbox',
      name: 'Inbox'
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