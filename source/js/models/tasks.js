import Task from './task.js'

// the main thing that holds all the tasks
export class tasks {
  constructor() {
    this.collection = new Map()
    console.log('tasks store created')
  }
  add(props) {
    // todo: collision detection
    let id = Math.round(Math.random()*100000).toString()
    props.id = id
    this.collection.set(id, new Task(props))
  }
  all() {
    return this.collection
  }
}
export let TasksCollection = new tasks()