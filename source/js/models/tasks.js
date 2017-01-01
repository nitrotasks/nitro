import Events from './events.js'
import Task from './task.js'

// the main thing that holds all the tasks
export class tasks extends Events {
  constructor(props) {
    super(props)
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

    this.trigger('update', props.list)
  }
  all() {
    return this.collection
  }
  getList(list, completed) {
    let returned = []
    if (list === 'all') {
      // return all tasks, ignore ids
      returned = Array.from(this.collection, function(item) {
        return item[1]
      })
    } else {
      // return the normal list
      this.collection.forEach(function(task) {
        if (task.list === list) {
          returned.push(task)
        }
      })
      if (list === 'today') {
        // + due today / overdue + priority
      } else if (list === 'next') {
        // + due at some point + priority
      }
    }
    return returned
  }
}
export let TasksCollection = new tasks()