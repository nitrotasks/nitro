import SyncQueue from '../models/syncQueue.js'
import SyncGet from '../models/syncGet.js'
import { ListsCollection } from './listsCollection.js'
import { TasksCollection } from './tasksCollection.js'
import authenticationStore from '../stores/auth.js'

// helpers
export class combined {
  constructor(props) {
    // sets up the syncs here, just for greater control
    // also reduces dependencies
    this.listsQueue = new SyncQueue({
      identifier: 'lists',
      endpoint: 'lists',
      arrayParam: 'lists',
      model: ListsCollection,
      serverParams: ['name', 'notes']
    })
    ListsCollection.setSync(this.listsQueue)
    this.tasksQueue = new SyncQueue({
      identifier: 'tasks',
      endpoint: 'lists',
      arrayParam: 'tasks',
      parentModel: ListsCollection,
      model: TasksCollection,
      serverParams: ['name', 'notes']
    })
    TasksCollection.setSync(this.tasksQueue)

    this.syncGet = new SyncGet({
      lists: ListsCollection,
      tasks: TasksCollection
    })

    // TODO: schedule this
    this.listsQueue.bind('request-process', function() {
      if (authenticationStore.isSignedIn()) {
        console.log('requested-lists')
        this.processQueue()
      }
    })
    this.tasksQueue.bind('request-process', function() {
      if (authenticationStore.isSignedIn()) {
        console.log('requested-tasks')
        this.processQueue()
      }
    })
  }
  downloadData() {
    this.syncGet.downloadLists().then((data) => {
      this.syncGet.updateLocal(data)
    })
  }
  addTask(task) {
    const id = TasksCollection.add(task)
    const order = ListsCollection.find(task.list).order
    order.push(id)
    ListsCollection.update(task.list, {order: order})
  }
  deleteList(list) {
    TasksCollection.deleteAllFromList(list)
    ListsCollection.delete(list)
  }
}
export let CombinedCollection = new combined()