import db from 'idb-keyval'
import config from '../../../config.js'
import Events from './events.js'
import { log, warn, error } from '../helpers/logger.js'
import { checkStatus } from '../helpers/fetch.js'
import { promiseSerial } from '../helpers/promise.js'

import { postItem, patchItem, deleteItem, deleteItems, archiveItem } from './syncQueueMethods.js'

import authenticationStore from '../stores/auth.js'

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
    this.identifier = props.identifier
    this.endpoint = props.endpoint
    this.arrayParam = props.arrayParam
    this.model = props.model
    this.parentModel = props.parentModel
    this.serverParams = props.serverParams
  }
  logger() {
    if (typeof(testMode) !== 'undefined') return // doesn't log in test
    const data = [...arguments]  
    log('%c' + data.join(' '), 'background: #ececec; color: #3a7df8;')
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
  requestProcess() {
    this.trigger('request-process')
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
            if (err) return reject(err)
            this.logger(this.identifier, 'Finished POSTING')
            resolve()
          })
        } else if (verb === 'patch') {
          if (this.queue.patch.length === 0) return resolve()
          this.doOperation(patchItem, this.queue.patch, (err) => {
            if (err) return reject(err)
            this.logger(this.identifier, 'Finished PATCHING')
            resolve()
          })
        } else if (verb === 'delete') {
          if (this.queue.delete.length === 0) return resolve()
          if (this.queue.delete[0].length === 2) {
            deleteItems(this.queue.delete, this.endpoint, this.model, this.parentModel, this.arrayParam).then(() => {
              this.queue.delete = []
              this.saveQueue()
              this.model.trigger('update')
              this.logger(this.identifier, 'Finished DELETING')
              resolve()
            }).catch(err => {
              if (err.status === 404) {
                err.response.items.forEach((item) => {
                  this.queue.delete.splice(this.queue.delete.findIndex(findQueueIndex(item)), 1)
                })
                this.saveQueue()
                console.log(this.identifier, 'Skipped a couple of deletions.')
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
                  
                  console.log(this.identifier, 'Skipped a couple of deletions... going for retry.')
                  this.doOperation(deleteItem, this.queue.delete, callback)
                } else {
                  console.warn(err)
                  reject()
                }
                return
              } 
              this.logger(this.identifier, 'Finished DELETING')
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
            })
          })
          promiseSerial(funcs).then(() => {
            this.logger(this.identifier, 'ARCHIVE Finished')
            return resolve()
          }).catch(err => {
            console.error(err)
            return reject(err)
          })
        } else {
          reject('No such verb.')
        }
      })
    }
  }
  post(id) {
    this.logger(this.identifier, 'POST Requested')
    // batches the objects together
    if (typeof id === 'object') {
      const index = this.queue.post.findIndex(function(element) {
        return element[0] === id[0]
      })
      if (index > -1) {
        this.queue.post[index][1].push(id[1])
      } else {
        this.queue.post.push([id[0], [id[1]]])
      }
    } else {
      this.queue.post.push(id)
    }
    this.saveQueue()
    this.requestProcess()
  }
  patch(id) {
    this.logger(this.identifier, 'PATCH Requested')
    // this is for tasks, so we look at the parent model
    if (typeof id === 'object') {
      const listServerId = this.parentModel.find(id[0]).serverId
      const taskServerId = this.model.find(id[1]).serverId

      // I realize this is duplicated logic, but it's a bit easier to work with in my head.
      if (!listServerId) {
        return this.logger(
          this.identifier,
          'Skipping PATCH - Parent still in POST queue'
        )
      }
      if (!taskServerId) {
        return this.logger(
          this.identifier,
          'Skipping PATCH - Still in POST Queue'
        )
      }

      const index = this.queue.patch.findIndex(function(element) {
        return element[0] === id[0]
      })
      // rev the queue details
      if (index > -1) {
        // if it's already in there, just rev the time
        const taskIndex = this.queue.patch[index][2].findIndex(function(
          element
        ) {
          return element[0] === id[1]
        })
        if (taskIndex > -1) {
          this.logger(this.identifier, 'Skipping PATCH Queue - Updating Time')
          this.queue.patch[index][2][taskIndex][2] = new Date().toISOString()
        } else {
          this.logger(this.identifier, 'Adding PATCH to previous queue.')
          this.queue.patch[index][2].push([
            id[1],
            taskServerId,
            new Date().toISOString()
          ])
        }
      } else {
        this.logger(this.identifier, 'Adding PATCH Queue.')
        this.queue.patch.push([
          id[0],
          listServerId,
          [[id[1], taskServerId, new Date().toISOString()]],
          new Date().toISOString()
        ])
      }
      this.saveQueue()
    } else {
      const serverId = this.model.find(id).serverId
      if (!serverId) {
        this.logger(
          this.identifier,
          'Skipping PATCH Request - Still in POST queue.'
        )
      } else if (this.queue.patch.find(findQueueIndex(serverId))) {
        this.logger(this.identifier, 'Skipping PATCH Request - Updating Time')
        this.queue.patch.find(
          findQueueIndex(serverId)
        )[2] = new Date().toISOString()
        this.saveQueue()
      } else {
        // includes the last updated time
        this.queue.patch.push([id, serverId, new Date().toISOString()])
        this.saveQueue()
      }
    }
    // ? what if race conditions :O
    this.requestProcess()
  }
  delete(id) {
    this.logger(this.identifier, 'DELETE Requested')
    if (typeof id === 'object') {
      const deleteFromPostQueue = () => {
        this.queue.post = this.queue.post
          .map(item => {
            const index = item[1].indexOf(id[1])
            if (index > -1) {
              item[1].splice(index, 1)
            }
            return item
          })
          .filter(item => {
            if (item[1].length > 0) {
              return true
            }
            return false
          })
      }
      const deleteFromPatchQueue = () => {
        this.queue.patch = this.queue.patch
          .map(item => {
            if (item[0] === id[0]) {
              const index = item[2].findIndex(patchItem => {
                if (patchItem[0] === id[1]) {
                  return true
                }
                return false
              })
              if (index > -1) {
                item[2].splice(index, 1)
                this.logger(
                  this.identifier,
                  'DELETE forced removal from PATCH Queue'
                )
              }
            }
            return item
          })
          .filter(item => {
            if (item[2].length > 0) {
              return true
            }
            return false
          })
      }

      const listServerId = this.parentModel.find(id[0]).serverId
      const taskServerId = this.model.find(id[1]).serverId

      const index = this.queue.delete.findIndex(function(element) {
        return element[0] === id[0]
      })

      if (!listServerId) {
        this.logger(
          this.identifier,
          'Skipping DELETE - Parent still in POST queue'
        )
        deleteFromPostQueue()
      } else if (!taskServerId) {
        this.logger(this.identifier, 'Skipping DELETE - Still in POST Queue')
        deleteFromPostQueue()
      } else if (index > -1) {
        const taskIndex = this.queue.delete[index][2].findIndex(function(
          element
        ) {
          return element[0] === id[1]
        })
        if (taskIndex > -1) {
          this.logger(
            this.identifier,
            'Skipping DELETE Queue - Already in there'
          )
        } else {
          this.logger(this.identifier, 'Adding DELETE to previous queue.')
          this.queue.delete[index][2].push([id[1], taskServerId])
          deleteFromPatchQueue()
        }
      } else {
        this.logger(this.identifier, 'Adding DELETE Queue.')
        this.queue.delete.push([id[0], listServerId, [[id[1], taskServerId]]])
        deleteFromPatchQueue()
      }
      this.saveQueue()
    } else {
      const serverId = this.model.find(id).serverId
      if (serverId === null) {
        this.logger(
          this.identifier,
          'Skipping DELETE Request - Deleting from POST queue.'
        )
        this.queue.post.splice(this.queue.post.indexOf(id), 1)
        this.saveQueue()
      } else if (this.queue.delete.find(findQueueIndex(serverId))) {
        this.logger(this.identifier, 'Skipping DELETE Request - Already Added')
      } else {
        this.queue.delete.push([id, serverId])
        this.saveQueue()
      }
    }
    this.requestProcess()
  }
  archive(id) {
    this.logger(this.identifier, 'ARCHIVE Requested')
    if (typeof id[1] === 'string') {
      id[1] = [id[1]]
    }

    const index = this.queue.archive.findIndex(function(element) {
      return element[0] === id[0]
    })

    if (index > -1) {
      this.queue.archive[index][1] = this.queue.archive[index][1].concat(id[1])
    } else {
      this.queue.archive.push([id[0], id[1]])
    }
    this.saveQueue()
    this.requestProcess()
  }
}
