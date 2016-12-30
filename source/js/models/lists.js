import List from './task.js'

// the main thing that holds all the tasks
export class lists {
  constructor() {
    this.collection = new Map()
    console.log('lists store created')
  }
  add(props) {
    // todo: collision detection
    let id = Math.round(Math.random()*100000).toString()
    props.id = id
    this.collection.set(id, new List(props))
  }
  all() {
    return this.collection
  }
}
export let ListsCollection = new lists()