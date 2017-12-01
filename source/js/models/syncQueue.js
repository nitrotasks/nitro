import db from 'idb-keyval'
import config from '../../../config.js'
import Events from './events.js'
import { checkStatus } from '../helpers/fetch.js'
import { log, warn, error } from '../helpers/logger.js'

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
      delete: []
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
    return db.get('sync-' + this.identifier).then((data) => {
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
  processQueue() {
    const postItem = (id) => {
      let body = null
      let resource = null
      let additionalEndpoint = ''
      // has to loop to get all the tasks
      if (typeof(id) === 'object') {
        // TODO, what is the data is missing from the client?
        additionalEndpoint = this.parentModel.find(id[0]).serverId

        // kill if the parents are not made
        if (additionalEndpoint === null) {
          return
        }
        resource = {}
        additionalEndpoint = '/' + additionalEndpoint
        const items = id[1].map((index) => {
          const item = this.model.find(index)
          resource[index] = item
          return item.toObject()
        })
        body = {
          [this.arrayParam]: items
        }
      } else {
        resource = this.model.find(id)
        body = resource.toObject()
      }
      fetch(`${config.endpoint}/${this.endpoint}${additionalEndpoint}`, {
        method: 'POST',
        headers: authenticationStore.authHeader(true),
        body: JSON.stringify(body)
      }).then(checkStatus).then((response) => {
        response.json().then((data) => {
          // copies the serverid back into the og, and then saves
          if (typeof(id) === 'object') {
            data[this.arrayParam].forEach(function(item) {
              resource[item.originalId].serverId = item.id
              resource[item.originalId].lastSync = item.updatedAt
            })
          } else {
            // copies data back in
            // only selected params
            resource.serverId = data.id
            resource.lastSync = data.updatedAt
            this.serverParams.forEach((param) => {
              resource[param] = data[param]
            })
          }
          this.queue.post.splice(0, 1)
          this.saveQueue()
          this.model.saveLocal()

          if (this.queue.post.length > 0) {
            postItem(this.queue.post[0])
          } else {
            this.logger(this.identifier, 'Finished POSTING')
            this.model.trigger('update')
          }
        })
      })
    }
    const patchItem = (id) => {
      let body = null
      let resource = null
      let additionalEndpoint = ''
      
      // different lengths have different levels of sync
      // so far, 3 is just used for lists, 4 is just used for tasks
      if (id.length === 3) {
        additionalEndpoint = '/' + id[1] // the server id
        resource = this.model.find(id[0]) // data we are updating
        body = resource.toObject()
        body.updatedAt = id[2] // server decides which data to use
      } else if (id.length === 4) {
        additionalEndpoint = '/' + id[1] + '/' + this.identifier // lists server id + /tasks for now
        
        const toSync = {}
        id[2].forEach((item) => {
          toSync[item[1]] = this.model.find(item[0])
          toSync[item[1]].updatedAt = item[2]
        })
        body = {
          tasks: toSync,
          updatedAt: id[3]
        }
      } else {
        return
      }
      fetch(`${config.endpoint}/${this.endpoint}${additionalEndpoint}`, {
        method: 'PATCH',
        headers: authenticationStore.authHeader(true),
        body: JSON.stringify(body)
      }).then(checkStatus).then((response) => {
        response.json().then((data) => {

          if (id.length === 3) {
            // copies data back in
            // only selected params
            resource.serverId = data.id
            resource.lastSync = data.updatedAt
            this.serverParams.forEach((param) => {
              resource[param] = data[param]
            })
          } else if (id.length === 4) {
            this.model.patchListFromServer(data.tasks, id[0])
          }

          // removes from queue & saves
          this.queue.patch.splice(0, 1)
          this.saveQueue()
          this.model.saveLocal()

          if (this.queue.patch.length > 0) {
            patchItem(this.queue.patch[0])
          } else {
            this.logger(this.identifier, 'Finished PATCHING')
            this.model.trigger('update')
          }
        })
      }).catch((err) => {
        error(err)
      })
    }
    const deleteItem = (id) => {
      const additionalEndpoint = '/' + id[1] + '/'
      const finalDeletions = id[2].map(item => item[1])

      const cb = (queue) => {
        this.saveQueue()

        if (queue.length > 0) {
          deleteItem(queue[0])
        } else {
          this.logger(this.identifier, 'Finished DELETING')
        }
      }

      fetch(`${config.endpoint}/${this.endpoint}${additionalEndpoint}`, {
        method: 'DELETE',
        headers: authenticationStore.authHeader(true),
        body: JSON.stringify({
          [this.arrayParam]: finalDeletions
        })
      }).then(checkStatus).then(() => {
        this.queue.delete.splice(0, 1)
        cb(this.queue.delete)
      }).catch((err) => {
        if (err.status === 404) {
          err.response.items.forEach((item) => {
            this.queue.delete[0][2].splice(this.queue.delete[0][2].findIndex(function(element) {
              return element[1] === item
            }), 1)
          })
          if (this.queue.delete[0][2].length === 0) {
            this.queue.delete.splice(0, 1)
          }
          
          this.logger(this.identifier, 'Skipped a couple of deletions... going for retry.')
          cb(this.queue.delete)
        } else {
          warn(err)
        }
      })
    }
    const deleteItems = (items) => {
      const finalDeletions = items.map(item => item[1])      
      fetch(`${config.endpoint}/${this.endpoint}`, {
        method: 'DELETE',
        headers: authenticationStore.authHeader(true),
        body: JSON.stringify({
          [this.arrayParam]: finalDeletions
        })
      }).then(checkStatus).then(() => {
        this.queue.delete = []
        this.saveQueue()
        this.logger(this.identifier, 'Finished DELETING')
      }).catch((err) => {
        if (err.status === 404) {
          err.response.items.forEach((item) => {
            this.queue.delete.splice(this.queue.delete.findIndex(findQueueIndex(item)), 1)
          })
          this.saveQueue()
          this.logger(this.identifier, 'Skipped a couple of deletions.')
        } else {
          warn(err)
        }
      })
    } 
    if (this.queue.delete.length > 0) {
      if (this.queue.delete[0].length === 2) {
        deleteItems(this.queue.delete)
      } else {
        deleteItem(this.queue.delete[0])
      }
    }
    if (this.queue.post.length > 0) {
      postItem(this.queue.post[0])
    }
    if (this.queue.patch.length > 0) {
      patchItem(this.queue.patch[0]) 
    }
  }
  post(id) {
    this.logger(this.identifier, 'POST Requested')
    // batches the objects together
    if (typeof(id) === 'object') {
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
    if (typeof(id) === 'object') {
      const listServerId = this.parentModel.find(id[0]).serverId
      const taskServerId = this.model.find(id[1]).serverId

      // I realize this is duplicated logic, but it's a bit easier to work with in my head.
      if (!listServerId) {
        return this.logger(this.identifier, 'Skipping PATCH - Parent still in POST queue')
      }
      if (!taskServerId) {
        return this.logger(this.identifier, 'Skipping PATCH - Still in POST Queue')
      }

      const index = this.queue.patch.findIndex(function(element) {
        return element[0] === id[0]
      })
      // rev the queue details
      if (index > -1) {
        // if it's already in there, just rev the time
        const taskIndex = this.queue.patch[index][2].findIndex(function(element) {
          return element[0] === id[1]
        })
        if (taskIndex > -1) {
          this.logger(this.identifier, 'Skipping PATCH Queue - Updating Time')
          this.queue.patch[index][2][taskIndex][2] = new Date().toISOString()
        } else {
          this.logger(this.identifier, 'Adding PATCH to previous queue.')
          this.queue.patch[index][2].push([id[1], taskServerId, new Date().toISOString()])          
        }
      } else {
        this.logger(this.identifier, 'Adding PATCH Queue.')
        this.queue.patch.push([id[0], listServerId, [[id[1], taskServerId, new Date().toISOString()]], new Date().toISOString()])
      }
      this.saveQueue()
    } else {
      const serverId = this.model.find(id).serverId
      if (!serverId) {
        this.logger(this.identifier, 'Skipping PATCH Request - Still in POST queue.')
      } else if (this.queue.patch.find(findQueueIndex(serverId))) {
        this.logger(this.identifier, 'Skipping PATCH Request - Updating Time')
        this.queue.patch.find(findQueueIndex(serverId))[2] = new Date().toISOString()
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
    if (typeof(id) === 'object') {
      const deleteFromPostQueue = () => {
        this.queue.post = this.queue.post.map((item) => {
          const index = item[1].indexOf(id[1])
          if (index > -1) {
            item[1].splice(index, 1)
          }
          return item
        }).filter((item) => {
          if (item[1].length > 0) {
            return true
          }
          return false
        })
      }
      const deleteFromPatchQueue = () => {
        this.queue.patch = this.queue.patch.map((item) => {
          if (item[0] === id[0]) {
            const index = item[2].findIndex((patchItem) => {
              if (patchItem[0] === id[1]) {
                return true
              }
              return false
            })
            if (index > -1) {
              item[2].splice(index, 1)
              this.logger(this.identifier, 'DELETE forced removal from PATCH Queue')
            }
          }
          return item
        }).filter((item) => {
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
        this.logger(this.identifier, 'Skipping DELETE - Parent still in POST queue')
        deleteFromPostQueue()
      } else if (!taskServerId) {
        this.logger(this.identifier, 'Skipping DELETE - Still in POST Queue')
        deleteFromPostQueue()
      } else if (index > -1) {
        const taskIndex = this.queue.delete[index][2].findIndex(function(element) {
          return element[0] === id[1]
        })
        if (taskIndex > -1) {
          this.logger(this.identifier, 'Skipping DELETE Queue - Already in there')
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
        this.logger(this.identifier, 'Skipping DELETE Request - Deleting from POST queue.')
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
}