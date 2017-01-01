import Events from './events.js'
import List from './list.js'

// the main thing that holds all the tasks
export class lists extends Events {
  constructor(props) {
    super(props)
    
    this.collection = new Map()
    console.log('lists store created')

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
  add(props) {
    // todo: collision detection
    let id = Math.round(Math.random()*100000).toString()
    props.id = id
    this.collection.set(id, new List(props))
  }
  find(id) {
    return this.collection.get(id)
  }
  all() {
    return this.collection
  }
}
export let ListsCollection = new lists()