import config from '../../../config.js'
import Events from './events.js'
import { checkStatus } from '../helpers/fetch.js'

import authenticationStore from '../stores/auth.js'

export default class Sync extends Events {
  constructor(props) {
    super(props)
    if (!'endpoint' in props) {
      throw new Error('Sync needs endpoint.')
    }
    this.queue = {
      post: [],
      patch: [],
      delete: []
    }
    this.endpoint = props.endpoint
    this.model = props.model
    this.loadQueue()
  }
  saveQueue() {
    requestAnimationFrame(() => {
      localStorage.setItem('nitro3-sync-' + this.endpoint, JSON.stringify(this.queue))
    })
  }
  loadQueue() {
    let data = localStorage.getItem('nitro3-sync-' + this.endpoint)
    if (data === null) {
      this.saveQueue()
      return
    }
    this.queue = JSON.parse(data)
    console.log(`Loaded ${this.endpoint} queue from localStorage`)
  }
  processQueue() {
    // TODO: Call this whenever.

    const postItem = (id) => {
      console.log('POSTING', this.endpoint, id)
      const resource = this.model.find(id)
      fetch(`${config.endpoint}/${this.endpoint}`, {
        method: 'POST',
        headers: authenticationStore.authHeader(true),
        body: JSON.stringify(resource.toObject())
      }).then(checkStatus).then((response) => {
        response.json().then((data) => {
          // copies the serverid back into the og, and then saves
          resource.serverId = data.id
          this.queue.post.splice(0, 1)
          this.saveQueue()
          this.model.saveLocal()

          if (this.queue.post.length > 0) {
            postItem(this.queue.post[0])
          } else {
            console.info('Finished uploading', this.endpoint)
          }
        })
      })
    }
    const deleteItems = (items) => {
      const finalDeletions = []
      items.forEach((item) => {
        // if the item is in the post queue, just remove from everything
        const index = this.queue.post.indexOf(item[0])
        if (index > -1) {
          console.info('IGNORING', item[0])
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
          lists: finalDeletions
        })
      }).then(checkStatus).then((response) => {
        this.queue.delete = []
        this.saveQueue()
        console.info('Finished deleting', this.endpoint)
      }).catch((err) => {
        console.warn(err)
      })
    }
    if (this.queue.delete.length > 0) {
      deleteItems(this.queue.delete)
    }
    if (this.queue.post.length > 0) {
      postItem(this.queue.post[0])
    }
  }
  get() {

  }
  post(id) {
    console.info(this.endpoint, 'POST Requested')
    this.queue.post.push(id)
    this.saveQueue()
    this.processQueue()
  }
  patch(id) {

  }
  delete(id) {
    console.info(this.endpoint, 'DELETE Requested')
    this.queue.delete.push([id, this.model.find(id).serverId])
    this.saveQueue()
    this.processQueue()
  }
}