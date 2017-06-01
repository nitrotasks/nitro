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
  add(props) {
    // TODO: collision detection
    let id = Math.round(Math.random()*100000).toString()
    props.id = id
    this.collection.set(id, new List(props))
    this.trigger('update')
    this.saveLocal()
    this.sync.post(id)
  }
  update(id) {
    this.find(id).name = Math.round(Math.random()*100000).toString()
    this.trigger('update')
    this.sync.patch(id)
    this.saveLocal()
  }
  delete(id) {
    this.sync.delete(id)
    this.collection.delete(id)
    this.trigger('update')
    this.saveLocal()
  }
  find(id) {
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
      name: 'All'
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