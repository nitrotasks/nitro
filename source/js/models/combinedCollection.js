import SyncQueue from '../models/syncQueue.js'
import SyncGet from '../models/syncGet.js'
import Events from './events.js'
import { ListsCollection } from './listsCollection.js'
import { TasksCollection } from './tasksCollection.js'
import authenticationStore from '../stores/auth.js'

// helpers
export class combined extends Events {
  constructor(props) {
    super(props)
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

    authenticationStore.bind('token', () => {
      this.downloadData()
    })
    TasksCollection.bind('update', this.update('tasks'))
    ListsCollection.bind('update', this.update('lists'))
  }
  update(key) {
    return () => {
      this.trigger('update', key)
    }
  }
  downloadData() {
    this.syncGet.downloadLists().then((data) => {
      this.syncGet.updateLocal(data)
    })
  }
  addTask(task) {
    const id = TasksCollection.add(task)
    const order = ListsCollection.find(task.list).localOrder
    order.unshift(id)
    this.updateOrder(task.list, order, false)
  }
  deleteTask(task) {
    const order = ListsCollection.find(task.list).localOrder
    order.splice(order.indexOf(task.id), 1)
    this.updateOrder(task.list, order, false)
    TasksCollection.delete(task.id)
  }
  updateOrder(id, order, sync = true) {
    const resource = ListsCollection.find(id)

    // updates the local order, then the server order
    resource.localOrder = order
    resource.order = order.map(localId => {
      return TasksCollection.find(localId).serverId
    }).filter(item => item !== null)
  
    ListsCollection.trigger('order')
    ListsCollection.saveLocal()
    if (sync) ListsCollection.sync.patch(id)
  }
  addList(props, sync) {
    ListsCollection.add(props, sync)
  }
  getList(listId, serverId) {
    const list = ListsCollection.find(listId, serverId).toObject()
    list.name = ListsCollection.escape(list.name)
    return list
  }
  getLists() {
    const lists = []
    ListsCollection.all().forEach(list => {
      list = list.toObject()
      list.name = ListsCollection.escape(list.name)
      list.count = TasksCollection.findListCount(list.id)
      lists.push(list)
    })
    return lists
  }
  deleteList(list) {
    TasksCollection.deleteAllFromList(list)
    ListsCollection.delete(list)
  }
  getTask() {

  }
  getTasks() {

  }
}
export let CombinedCollection = new combined()