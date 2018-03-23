import db from 'idb-keyval'
import Events from './events.js'
import { log, warn, error } from '../helpers/logger.js'
import { promiseSerial } from '../helpers/promise.js'

import { postItem, patchItem, deleteItem, deleteItems, archiveItem } from './syncQueueMethods.js'
import { postQueue, patchQueue, deleteQueue, archiveQueue } from './syncQueueAdders.js'

const findQueueIndex = function(item) {
  return function(element) {
    return element[1] === item
  }
}

export default class Sync extends Events {
  constructor(props) {
    super(props)
    if (!('endpoint' in props) || !('identifier' in props)) {
      throw new Error('Sync needs endpoint & identifier.')
    }
    this.queue = {
      post: [],
      patch: [],
      delete: [],
      archive: []
    }
    this.syncLock = false
    this.syncUnlock = []
    this.identifier = props.identifier
    this.endpoint = props.endpoint
    this.arrayParam = props.arrayParam
    this.model = props.model
    this.parentModel = props.parentModel
    this.serverParams = props.serverParams
  }
  saveQueue() {
    db.set('sync-' + this.identifier, this.queue)
  }
  loadQueue() {
    return db.get('sync-' + this.identifier).then(data => {
      if (typeof data === 'undefined') {
        this.saveQueue()
        return
      }
      this.queue = data
    })
  }
  doOperation(fn, queue, cb) {
    if (queue.length > 0) {
      fn(queue[0],
        this.endpoint,
        this.model,
        this.parentModel,
        this.arrayParam,
        this.serverParams,
        this.identifier
      ).then(() => {
        queue.splice(0, 1)
        this.saveQueue()
        this.model.saveLocal()
        // runs recursively
        this.doOperation(fn, queue, cb)
      }).catch((err) => {
        cb(err)
      })
    } else {
      this.model.trigger('update')
      cb()
    }
  }
  processVerb(verb) {
    return () => {
      return new Promise((resolve, reject) => {
        if (verb === 'post') {
          if (this.queue.post.length === 0) return resolve()
          this.doOperation(postItem, this.queue.post, (err) => {
            if (err) {
              console.error('Error! Skipping POST Operation for Now.', err)
              resolve()
              return
            }
            log(this.identifier, 'Finished POSTING')
            resolve()
          })
        } else if (verb === 'patch') {
          if (this.queue.patch.length === 0) return resolve()
          this.doOperation(patchItem, this.queue.patch, (err) => {
            if (err) return reject(err)
            log(this.identifier, 'Finished PATCHING')
            resolve()
          })
        } else if (verb === 'delete') {
          if (this.queue.delete.length === 0) return resolve()
          if (this.queue.delete[0].length === 2) {
            deleteItems(this.queue.delete, this.endpoint, this.model, this.parentModel, this.arrayParam).then(() => {
              this.queue.delete = []
              this.saveQueue()
              this.model.trigger('update')
              log(this.identifier, 'Finished DELETING')
              resolve()
            }).catch(err => {
              if (err.status === 404) {
                err.response.items.forEach((item) => {
                  this.queue.delete.splice(this.queue.delete.findIndex(findQueueIndex(item)), 1)
                })
                this.saveQueue()
                log(this.identifier, 'Skipped a couple of deletions.')
                resolve()
              } else {
                reject(err)
              }
            })
          } else {
            const callback = (err) => {
              if (err) {
                if (err.status === 404) {
                  err.response.items.forEach((item) => {
                    this.queue.delete[0][2].splice(this.queue.delete[0][2].findIndex(function(element) {
                      return element[1] === item
                    }), 1)
                  })
                  if (this.queue.delete[0][2].length === 0) {
                    this.queue.delete.splice(0, 1)
                  }
                  
                  log(this.identifier, 'Skipped a couple of deletions... going for retry.')
                  this.doOperation(deleteItem, this.queue.delete, callback)
                } else {
                  warn(err)
                  reject()
                }
                return
              } 
              log(this.identifier, 'Finished DELETING')
              resolve()
            }
            this.doOperation(deleteItem, this.queue.delete, callback)
          }
        } else if (verb === 'archive') {
          if (this.queue.archive.length === 0) return resolve()
          const funcs = this.queue.archive.map(item => () => {
            return archiveItem(item, this.endpoint, this.model, this.parentModel).then(() => {
              // removes local archive of that particular list
              db.delete('archive-' + item[0])
              this.queue.archive.splice(0, 1)
              this.saveQueue()
              // remove the item 
              const localTasks = this.model.mapToLocal(item[1])
              this.model.deleteTasks(localTasks)
            })
          })
          promiseSerial(funcs).then(() => {
            log(this.identifier, 'ARCHIVE Finished')
            return resolve()
          }).catch(err => {
            error(err)
            return reject(err)
          })
        } else {
          reject('No such verb.')
        }
      })
    }
  }
  addToQueue(id, method) {
    const fn = () => {
      if (method === 'post') {
        postQueue(id, this.queue, this.identifier)
      } else if (method === 'patch') {
        patchQueue(id, this.queue, this.identifier, this.model, this.parentModel)
      } else if (method === 'delete') {
        deleteQueue(id, this.queue, this.identifier, this.model, this.parentModel)
      } else if (method === 'archive') {
        archiveQueue(id, this.queue, this.identifier)
      }
    }
    if (this.syncLock === true) {
      log(this.identifier, 'Sync in Progress, deferring', method.toUpperCase())
      this.syncUnlock.push(fn)
    } else { 
      this.syncLock = true
      fn()
      this.saveQueue()
      this.syncLock = false
      this.runDeferred()
      this.trigger('request-process')
    }
  }
  hasItems() {
    let hasItems = false
    Object.keys(this.queue).forEach(i => {
      if (this.queue[i].length > 0) {
        hasItems = true
      }
    })
    return hasItems
  }
  runDeferred() {
    if (this.syncUnlock.length > 0) {
      this.syncLock = true
      this.syncUnlock.forEach(fn => fn())
      this.syncUnlock = []
      this.syncLock = false
      return true
    }
    return false
  }
}
