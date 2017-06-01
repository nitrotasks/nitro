import config from '../../../config.js'
import Events from './events.js'
import { checkStatus } from '../helpers/fetch.js'

import authenticationStore from '../stores/auth.js'

const findQueueIndex = function(item) {
  return function(element) {
    return element[1] === item
  }
}

export default class Sync extends Events {
  constructor(props) {
    super(props)
    if (!'endpoint' in props || !'identifier' in props) {
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
    this.loadQueue()
  }
  logger() {
    const data = [...arguments]  
    console.log('%c' + data.join(' '), 'background: #ececec; color: #3a7df8;')
  }
  saveQueue() {
    requestAnimationFrame(() => {
      localStorage.setItem('nitro3-sync-' + this.identifier, JSON.stringify(this.queue))
    })
  }
  loadQueue() {
    let data = localStorage.getItem('nitro3-sync-' + this.identifier)
    if (data === null) {
      this.saveQueue()
      return
    }
    this.queue = JSON.parse(data)
    this.logger(`Loaded ${this.identifier} queue from localStorage`)
  }
  requestProcess() {
    this.trigger('request-process')
  }
  processQueue() {
    // TODO: Call this whenever.

    const postItem = (id) => {
      let body = null
      let resource = null
      let additionalEndpoint = ''
      // has to loop to get all the tasks
      if (typeof(id) === 'object') {
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
            this.logger('Finished POSTING', this.identifier)
            this.model.trigger('update')
          }
        })
      })
    }
    const patchItem = (id) => {
      let body = null
      let resource = null
      let additionalEndpoint = ''
      if (!length in id) {
        // todo, batched updates
        console.error('not implemented!')
        return
      } else {
        additionalEndpoint = '/' + id[1] // the server id
        resource = this.model.find(id[0]) // data we are updating
        body = resource.toObject()
        body.updatedAt = id[2] // server decides which data to use
      }
      fetch(`${config.endpoint}/${this.endpoint}${additionalEndpoint}`, {
        method: 'PATCH',
        headers: authenticationStore.authHeader(true),
        body: JSON.stringify(body)
      }).then(checkStatus).then((response) => {
        response.json().then((data) => {
          // copies data back in
          // only selected params
          resource.serverId = data.id
          resource.lastSync = data.updatedAt
          this.serverParams.forEach((param) => {
            resource[param] = data[param]
          })

          // removes from queue & saves
          this.queue.patch.splice(0, 1)
          this.saveQueue()
          this.model.saveLocal()

          if (this.queue.patch.length > 0) {
            patchItem(this.queue.patch[0])
          } else {
            this.logger('Finished PATCHING', this.identifier)
            this.model.trigger('update')
          }
        })
      }).catch((err) => {
        console.error(err)
      })
    }
    const deleteItems = (items) => {
      const finalDeletions = []
      items.forEach((item) => {
        // if the item is in the post queue, just remove from everything
        const index = this.queue.post.indexOf(item[0])
        if (index > -1) {
          this.logger('IGNORING', item[0])
          this.queue.post.splice(index, 1)
        } else {
          finalDeletions.push(item[1])
        }
      })
      this.saveQueue()

      fetch(`${config.endpoint}/${this.endpoint}`, {
        method: 'DELETE',
        headers: authenticationStore.authHeader(true),
        body: JSON.stringify({
          [this.arrayParam]: finalDeletions
        })
      }).then(checkStatus).then((response) => {
        this.queue.delete = []
        this.saveQueue()
        this.logger('Finished DELETING', this.identifier)
      }).catch((err) => {
        if (err.status === 404) {
          err.response.items.forEach((item) => {
            this.queue.delete.splice(this.queue.delete.findIndex(findQueueIndex(item)), 1)
          })
          this.saveQueue()
          this.logger('Skipped a couple of deletions', this.identifier)
        } else {
          console.warn(err)
        }
      })
    } 
    if (this.queue.delete.length > 0) {
      deleteItems(this.queue.delete)
    }
    if (this.queue.post.length > 0) {
      postItem(this.queue.post[0])
    }
    if (this.queue.patch.length > 0) {
      patchItem(this.queue.patch[0]) 
    }
  }
  get() {

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
    const serverId = this.model.find(id).serverId
    if (!serverId) {
      this.logger(this.identifier, 'Skipping PATCH Request - Still in POST queue.')
    } else if (this.queue.patch.find(findQueueIndex(serverId))) {
      this.logger(this.identifier, 'Skipping PATCH Request - Updating Time')
      this.queue.patch.find(findQueueIndex(serverId))[2] = new Date().toISOString()
    } else {
      // includes the last updated time
      this.queue.patch.push([id, serverId, new Date().toISOString()])
      this.saveQueue()
    }
    // ? what if race conditions :O
    this.requestProcess()
  }
  delete(id) {
    this.logger(this.identifier, 'DELETE Requested')
    const serverId = this.model.find(id).serverId
    if (this.queue.delete.find(findQueueIndex(serverId))) {
      this.logger(this.identifier, 'Skipping DELETE Request - Already Added')
    } else {
      this.queue.delete.push([id, serverId])
      this.saveQueue()
    }
    this.requestProcess()
  }
}