// @flow
import Events from './events.js'
import { authEvents } from './models/authEvents'

import { ListsCollection } from './collections/listsCollection.js'
import { TasksCollection } from './collections/tasksCollection.js'

import SyncQueue from './sync/syncQueue.js'
import SyncGet from './sync/syncGet.js'
import { broadcast } from './sync/broadcastchannel.js'
import authenticationStore from './sync/auth.js'

import { log, warn, error, logHistory } from './helpers/logger.js'

const systemLists = ['inbox', 'today', 'next', 'all']
const fakeLists = ['today', 'next', 'all']

const getBlankDate = () => {
  const date = new Date()
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)
  return date
}

// helpers
export class sdk extends Events {
  constructor() {
    super()
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

    this.listsQueue.bind('request-process', this._processQueue)
    this.tasksQueue.bind('request-process', this._processQueue)
    this.tasksQueue.bind('request-archive', this._processQueue)

    authenticationStore.bind(authEvents.SIGN_IN, () => {
      if (authenticationStore.isSignedIn()) {
        broadcast.start()
      }
    })
    authenticationStore.bind(authEvents.TOKEN_READY, this.fullSync)
    authenticationStore.bind(authEvents.WEBSOCKET, this._handleWs)
    broadcast.bind('refresh-db', this._refreshDb)
    TasksCollection.bind('update', this._updateEvent('tasks'))
    ListsCollection.bind('update', this._updateEvent('lists'))
    ListsCollection.bind('order', this._orderEvent)
    ListsCollection.bind('lists-order', this._listsOrderEvent)

    // pass all the authentication store events through
    authenticationStore.bind(
      authEvents.SIGN_IN,
      this._passEvent(authEvents.SIGN_IN)
    )
    authenticationStore.bind(
      authEvents.SIGN_IN_ERROR,
      this._passEvent(authEvents.SIGN_IN_ERROR)
    )
    authenticationStore.bind(
      authEvents.UNIVERSAL_ERROR,
      this._passEvent(authEvents.UNIVERSAL_ERROR)
    )

    this.interval = setInterval(this.wsSync, 60000)
  }
  loadData(raiseEvent: boolean = false): Promise<any> {
    return new Promise((resolve, reject) => {
      authenticationStore.loadLocal(raiseEvent)
      ListsCollection.loadLocal()
        .then(() => TasksCollection.loadLocal())
        .then(() =>
          Promise.all([
            this.listsQueue.loadQueue(),
            this.tasksQueue.loadQueue()
          ])
        )
        .then(() => {
          if (raiseEvent) {
            this.trigger('update', 'lists', 'update-all')
            this.trigger('update', 'tasks', 'update-all')
          }
        })
        .then(resolve)
        .catch(reject)
    })
  }
  fullSync = bypassMaster => {
    log('Starting Full Sync')
    const listItems = this.listsQueue.hasItems()
    const taskItems = this.tasksQueue.hasItems()
    if (listItems || taskItems) {
      this._processQueue().then(() => this.downloadData(bypassMaster))
    } else {
      this.downloadData(bypassMaster)
    }
  }
  _handleWs = (data: Object) => {
    if (data.command === 'sync-complete') {
      this.downloadData()
    } else if (data.command === 'connected') {
      if (
        this.lastSync !== undefined &&
        new Date().getTime() - this.lastSync.getTime() > 30000
      ) {
        this.downloadData()
      }
    }
  }
  _refreshDb = () => {
    log('Reloading from Database...')
    this.loadData(true).then(() => {
      log('Database Reloaded.')
    })
  }
  _passEvent = (event: string) => {
    return (value: string) => {
      this.trigger(event, value)
    }
  }
  _updateEvent(key: string) {
    return (value: string, value2) => {
      this.trigger('update', key, value, value2)
    }
  }
  _orderEvent = (key: string) => {
    this.trigger('order', key)
  }
  _listsOrderEvent = () => {
    this.trigger('lists-order')
  }
  // just checks if anything was left over in the queue
  _runDeferred = () => {
    const listsDeferred = this.listsQueue.runDeferred()
    const tasksDeferred = this.tasksQueue.runDeferred()
    const listItems = this.listsQueue.hasItems()
    const taskItems = this.tasksQueue.hasItems()
    if (listsDeferred || tasksDeferred || listItems || taskItems) {
      this._processQueue()
    }
  }
  _processQueue = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!authenticationStore.isSignedIn(true)) return resolve()
      this.trigger('sync-upload-start')
      log('Starting Sync to Server')

      if (
        this.tasksQueue.syncLock === true ||
        this.listsQueue.syncLock === true
      ) {
        this.trigger('sync-upload-complete')
        return reject(
          'Sync is currently locked by another process. Will not process queue to server.'
        )
      }

      window.onbeforeunload = () =>
        'Nitro is syncing - your unsaved changes may be lost if you leave'

      this.listsQueue.syncLock = true
      this.tasksQueue.syncLock = true

      // process listpost
      authenticationStore
        .checkToken()
        .then(this.listsQueue.processVerb('post'))
        .then(() => {
          return Promise.all([
            this.tasksQueue.processVerb('post')(),
            this.tasksQueue.processVerb('patch')(),
            this.tasksQueue.processVerb('delete')()
          ])
        })
        .then(this.tasksQueue.processVerb('archive'))
        .then(this.listsQueue.processVerb('patch'))
        .then(this.listsQueue.processVerb('delete'))
        .then(this.listsQueue.processVerb('meta'))
        .then(authenticationStore.emitFinish)
        .then(() => {
          this.listsQueue.syncLock = false
          this.tasksQueue.syncLock = false
          window.onbeforeunload = null
          log('Sync to Server Complete')
          resolve()

          this._runDeferred()
          this.trigger('sync-upload-complete')
        })
        .catch(err => {
          this.listsQueue.syncLock = false
          this.tasksQueue.syncLock = false
          window.onbeforeunload = null

          if (err.status === 404) {
            log('Got a 404, going to redownload from server in attempt to fix.')
            this.downloadData()
            resolve()
          } else {
            error(err)
            reject(err)
          }
          this.trigger('sync-upload-complete')
        })
    })
  }
  wsSync = () => {
    // will run a sync if the websocket is not connected
    if (!authenticationStore.isConnected()) {
      this.downloadData()
    }
  }
  stopInterval = () => {
    clearInterval(this.interval)
  }
  isSignedIn = (tokenCheck: boolean) => {
    return authenticationStore.isSignedIn(tokenCheck)
  }
  signIn = (username: string, password: string) => {
    return authenticationStore.formSignIn(username, password)
  }
  requestUniversalAuth = () => {
    return authenticationStore.requestUniversalAuth()
  }
  handleUniversalAuth = () => {
    return authenticationStore.handleUniversalAuth()
  }
  signOut = (message: string, deleteSession: ?boolean) => {
    return authenticationStore.signOut(message, deleteSession)
  }
  createAccount = (username: string, password: string) => {
    return authenticationStore.createAccount(username, password)
  }
  downloadData = (bypassMaster = false) => {
    // the other tab will download data, and it's just passed through
    if (!broadcast.isMaster() && bypassMaster === false) return
    if (!authenticationStore.isSignedIn(true)) return
    if (
      this.tasksQueue.syncLock === true ||
      this.listsQueue.syncLock === true
    ) {
      // it's kinda okay if it doesn't get called,
      // because I'm sure I'll call this function again
      // with our websocket or whatever
      return
    }
    this.listsQueue.syncLock = true
    this.tasksQueue.syncLock = true

    log('Starting Download from Server')
    authenticationStore
      .checkToken()
      .then(() => {
        return this.syncGet.downloadLists()
      })
      .then(data => {
        this.syncGet.updateLocal(data).then(() => {
          this.listsQueue.syncLock = false
          this.tasksQueue.syncLock = false
          log('Finished Download From Server')

          this._runDeferred()
          this.lastSync = new Date()
          this.trigger('sync-download-complete')
        })
      })
      .catch(err => {
        error(err)
        this.listsQueue.syncLock = false
        this.tasksQueue.syncLock = false
        this._runDeferred()
        this.trigger('sync-download-complete')
      })
  }
  addTask(task: Object): Object | null {
    const list = ListsCollection.find(task.list)
    if (list === null) {
      throw new Error('List could not be found')
    } else if (task.list === 'today') {
      task.list = 'inbox'
      task.date = getBlankDate()
    } else if (task.list === 'next') {
      task.list = 'inbox'
      task.date = getBlankDate()
      task.date.setDate(task.date.getDate() + 1)
    }
    const id = TasksCollection.add(task)
    // look up again because the list may have changed
    const order = ListsCollection.find(task.list).localOrder
    order.unshift(id)
    this.updateTasksOrder(task.list, order, false)
    return this.getTask(id)
  }
  getTask(id: string, server: ?boolean): Object | null {
    const task = TasksCollection.find(id, server)
    if (task === null) {
      return null
    }
    return task.toObject()
  }
  getTasks(id: string, sync: ?boolean): Object | null {
    const list = ListsCollection.find(id, sync)
    if (list === null) {
      return null
    }
    const tasks = TasksCollection.findList(id, sync)
    let order = list.localOrder.slice()
    if (order.length !== tasks.length) {
      if (list.id === 'today' || list.id === 'next') {
        order = tasks.map(t => t.id)
      } else {
        // if the order doesn't contain all the tasks in the list, add them on
        const allTasks = tasks.map(t => {
          if (order.indexOf(t.id) === -1) {
            order.unshift(t.id)
          }
          return t.id
        })
        order = order.filter(t => allTasks.indexOf(t) !== -1)
      }
    }
    return {
      tasks: tasks,
      order: order
    }
  }
  getTasksSyncStatus(listId: string) {
    const flatten = (accumulator, currentValue) =>
      accumulator.concat(currentValue)

    if (fakeLists.includes(listId)) {
      // gets all the tasks from all the original lists
      const originalLists = Array.from(
        new Set(this.getTasks(listId).tasks.map(t => t.list))
      )

      // gets the sync status of all those original lists
      const allItems = originalLists.map(l => this.getTasksSyncStatus(l))

      // smushes them to one array
      return {
        post: allItems.map(i => i.post).reduce(flatten, []),
        patch: allItems.map(i => i.patch).reduce(flatten, [])
      }
    }

    const post = this.tasksQueue.queue.post
      .filter(i => i[0] === listId)
      .map(i => i[1])
      .reduce(flatten, [])
    const patch = this.tasksQueue.queue.patch
      .filter(i => i[0] === listId)
      .map(i => i[2].map(j => j[0]))
      .reduce(flatten, [])

    return {
      post: post,
      patch: patch
    }
  }
  updateTask(id: string, newProps: Object): Object {
    const task = TasksCollection.update(id, newProps)
    if (task === null) throw new Error('Task could not be found')
    return task
  }
  search(query: string): Array<Object> {
    const regex = new RegExp(query, 'i')
    const results = []
    ListsCollection.all().forEach(list => {
      const name = ListsCollection.escape(list.name)
      const result = name.match(regex)
      if (result !== null) {
        results.push({
          type: 'list',
          id: list.id,
          icon: list.id,
          name: name,
          subtitle: null,
          url: `/${list.id}`,
          priority: result.index
        })
      }
    })
    TasksCollection.all().forEach(task => {
      const nameResult = task.name ? task.name.match(regex) : null
      const notesResult = task.notes ? task.notes.match(regex) : null
      if (nameResult !== null || notesResult !== null) {
        results.push({
          type: 'task',
          id: task.id,
          icon:
            task.type === 'header' || task.type === 'header-collapsed'
              ? 'header'
              : 'task',
          name: task.name,
          subtitle: this.getList(task.list).name,
          url: `/${task.list}/${task.id}`,
          priority: (nameResult || notesResult).index
        })
      }
    })
    results.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'task' ? 1 : -1
      }
      const difference = a.priority - b.priority
      if (difference === 0) {
        return (a.name || '').localeCompare(b.name || '')
      }
      return difference
    })
    // truncated to 20 results for speed in the UI
    return results.slice(0, 20)
  }
  _removeFromList(ids: Array<string>, listId: string) {
    const order = ListsCollection.find(listId).localOrder.filter(i => {
      return !(ids.indexOf(i) > -1)
    })
    this.updateTasksOrder(listId, order, false)
    ListsCollection.saveLocal()
  }
  _getHeaders(list): Object {
    const tasks = this.getTasks(list)
    let currentHeader = null
    let headers = {}
    if (tasks === null) return {}
    tasks.order.forEach(taskId => {
      const task = this.getTask(taskId)
      if (task.type === 'header' || task.type === 'header-collapsed') {
        currentHeader = task.name
      }
      headers[taskId] = currentHeader
    })
    return headers
  }
  completeTask(id: string, server: ?boolean) {
    const task = this.getTask(id, server)
    if (task === null) throw new Error('Task could not be found')
    let completed = task.completed === null ? new Date() : null
    TasksCollection.update(task.id, { completed: completed })
  }
  archiveTask(id: string, server: ?boolean) {
    const task = this.getTask(id, server)
    const signedin = authenticationStore.isSignedIn(true)
    if (task === null) throw new Error('Task could not be found')
    const list = this.getList(task.list)
    if (list === null) throw new Error('List could not be found?')

    if (task.serverId === null && signedin === true)
      throw new Error('Cannot archive an unsynced task')
    let headers = null
    if (!signedin) {
      headers = this._getHeaders(task.list)
      this._removeFromList([task.id], task.list)
    }
    return TasksCollection.archiveMultiple(
      [task.id],
      list.id,
      list.name,
      signedin,
      headers
    )
  }
  archiveHeading(id: string, server: ?boolean) {
    const task = this.getTask(id, server)
    if (
      task === null ||
      (task.type !== 'header' && task.type !== 'header-collapsed')
    ) {
      throw new Error('Group could not be found')
    }
    const list = this.getList(task.list)
    const tasks = this.getTasks(task.list)
    if (tasks === null || list === null)
      throw new Error('List could not be found?')
    const unsynced = []
    const headers = tasks.tasks
      .filter(t => {
        if (t.serverId === null || typeof t.serverId === 'undefined') {
          unsynced.push(t.id)
        }
        return t.type === 'header' || t.type === 'header-collapsed'
      })
      .map(t => t.id)

    // gets the tasks between two headers
    let started = false
    const signedin = authenticationStore.isSignedIn(true)
    const toArchive = tasks.order.filter(i => {
      if (i === task.id) {
        started = true
      } else if (headers.indexOf(i) > -1) {
        started = false
      }
      if (signedin && unsynced.indexOf(i) > -1) {
        return false
      }
      return started
    })
    let headings = null
    if (!signedin) {
      headings = this._getHeaders(task.list)
      this._removeFromList(toArchive, task.list)
    }
    return TasksCollection.archiveMultiple(
      toArchive,
      task.list,
      list.name,
      signedin,
      headings
    )
  }
  archiveCompletedList(id: string, server: ?boolean) {
    const list = this.getList(id)
    const tasks = this.getTasks(id, server)
    if (tasks === null || list === null)
      throw new Error('List could not be found?')

    const signedin = authenticationStore.isSignedIn(true)
    const toArchive = tasks.tasks
      .filter(task => {
        if (
          !signedin ||
          (task.serverId !== null && typeof task.serverId !== 'undefined')
        ) {
          return (
            task.completed !== null && typeof task.completed !== 'undefined'
          )
        }
        return false
      })
      .map(task => task.id)

    // looks through the list and checks the order
    let headers = null

    // doesn't remove stuff from an immutable list
    if (!signedin && !fakeLists.includes(list.id)) {
      headers = this._getHeaders(id)
      this._removeFromList(toArchive, id)
    }
    return TasksCollection.archiveMultiple(
      toArchive,
      id,
      list.name,
      signedin,
      headers
    )
  }
  deleteTask(id: string, server: ?boolean) {
    const task = this.getTask(id, server)
    if (task === null) throw new Error('Task could not be found')
    const order = this.getList(task.list).localOrder.slice()
    order.splice(order.indexOf(task.id), 1)
    this.updateTasksOrder(task.list, order, false, false)
    TasksCollection.delete(task.id, authenticationStore.isLocalAccount())
  }
  updateListsOrder(order: Array<string>, sync: boolean = true) {
    ListsCollection.updateOrder(order)
    ListsCollection.saveLocal()

    if (sync) ListsCollection.sync.addToQueue('list-order', 'meta', 'lists')
  }
  updateTasksOrder(
    listId: string,
    order: Array<string>,
    sync: boolean = true,
    raiseEvent: boolean = true
  ) {
    const resource = ListsCollection.find(listId)

    // updates the local order, then the server order
    resource.localOrder = order

    const preProcessCallback = () => {
      resource.order = order
        .map(localId => {
          const task = TasksCollection.find(localId)
          if (task === null) return null
          return task.serverId
        })
        .filter(item => item !== null)
    }

    if (sync) {
      ListsCollection.sync.addPreProcess(preProcessCallback)
      ListsCollection.sync.addPreProcess(() => {
        ListsCollection.sync.addToQueue(listId, 'patch', 'lists')
      })
    } else {
      preProcessCallback()
    }

    if (raiseEvent) {
      ListsCollection.trigger('order')
    }
    ListsCollection.saveLocal()
  }
  addList(props: Object, sync: ?boolean): Object {
    const newList = ListsCollection.add(props, sync)
    return newList.toObject()
  }
  getList(listId: string, serverId: ?boolean): Object | null {
    let list = ListsCollection.find(listId, serverId)
    if (list === null) {
      return null
    }
    list = list.toObject()
    list.name = ListsCollection.escape(list.name)
    return list
  }
  getLists(): Array<Object> {
    return ListsCollection.order.map(list => {
      list = ListsCollection.find(list).toObject()
      list.name = ListsCollection.escape(list.name)
      list.count = TasksCollection.findListCount(list.id)
      return list
    })
  }
  updateList(listId: string, props: Object, serverId: ?boolean) {
    const list = ListsCollection.find(listId, serverId)
    if (list === null) throw new Error('List could not be found')
    if ('name' in props) {
      // reserved name
      if (props.name.slice(0, 9) === 'nitrosys-') {
        props.name = props.name.slice(9)
      } else if (systemLists.indexOf(listId) !== -1) {
        delete props.name
      }
    }
    ListsCollection.update(listId, props)
  }
  deleteList(listId: string, serverId: ?boolean) {
    if (systemLists.indexOf(listId) !== -1) {
      throw new Error('Not allowed to delete system lists.')
    }
    const list = this.getList(listId, serverId)
    if (list === null) {
      throw new Error('List could not be found.')
    }
    TasksCollection.deleteAllFromList(list.id)
    ListsCollection.delete(list.id, authenticationStore.isLocalAccount())
  }
}
export let NitroSdk = new sdk()
export { Events, logHistory, authEvents }
