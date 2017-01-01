import Task from './task.js'

// the main thing that holds all the tasks
export class tasks {
  constructor() {
    // two stores, one for current tasks, one for completed
    this.collection = new Map()
    this.completedcollection = new Map()
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
  getList(list, completed) {
    if (list === 'today') {
      // return next list + due today / overdue + priority
    } else if (list === 'next') {
      // return next list + due at some point + priority
    } else if (list === 'all') {
      // return all tasks  
    } else {
      // return the normal list
    }
  }
}
export let TasksCollection = new tasks()