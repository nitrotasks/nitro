import { checkStatus } from '../helpers/fetch.js'

import config from '../../../config.js'
import authenticationStore from '../stores/auth.js'

export const postItem = (id, endpoint, model, parentModel, arrayParam, serverParams) => {
  return new Promise((resolve, reject) => {
    let body = null
    let resource = null
    let additionalEndpoint = ''
    // has to loop to get all the tasks
    if (typeof(id) === 'object') {
      // if there's no parent, just resolve the queue. nothing to see here
      const parent = parentModel.find(id[0])
      if (parent === null) {
        return resolve()
      }
      additionalEndpoint = parent.serverId

      // kill if the parents are not made
      if (additionalEndpoint === null) {
        return
      }
      resource = {}
      additionalEndpoint = '/' + additionalEndpoint
      const items = id[1].map((index) => {
        const item = model.find(index)
        resource[index] = item
        return item.toObject()
      })
      body = {
        [arrayParam]: items
      }
    } else {
      resource = model.find(id)
      body = resource.toObject()
    }
    fetch(`${config.endpoint}/${endpoint}${additionalEndpoint}`, {
      method: 'POST',
      headers: authenticationStore.authHeader(true),
      body: JSON.stringify(body)
    }).then(checkStatus).then((response) => {
      response.json().then((data) => {
        // copies the serverid back into the og, and then saves
        if (typeof(id) === 'object') {
          data[arrayParam].forEach(function(item) {
            resource[item.originalId].serverId = item.id
            resource[item.originalId].lastSync = item.updatedAt
          })
        } else {
          // copies data back in
          // only selected params
          resource.serverId = data.id
          resource.lastSync = data.updatedAt
          serverParams.forEach((param) => {
            resource[param] = data[param]
          })
        }
        resolve()
      })
    }).catch(reject)
  })
}
export const patchItem = (id, endpoint, model, parentModel, arrayParam, serverParams, identifier) => {
  return new Promise((resolve, reject) => {
    let body = null
    let resource = null
    let additionalEndpoint = ''
    
    // different lengths have different levels of sync
    // so far, 3 is just used for lists, 4 is just used for tasks
    if (id.length === 3) {
      additionalEndpoint = '/' + id[1] // the server id
      resource = model.find(id[0]) // data we are updating
      body = resource.toObject()
      body.updatedAt = id[2] // server decides which data to use
    } else if (id.length === 4) {
      additionalEndpoint = '/' + id[1] + '/' + identifier // lists server id + /tasks for now
      
      const toSync = {}
      id[2].forEach((item) => {
        toSync[item[1]] = model.find(item[0])
        toSync[item[1]].updatedAt = item[2]
      })
      body = {
        tasks: toSync,
        updatedAt: id[3]
      }
    } else {
      return
    }
    fetch(`${config.endpoint}/${endpoint}${additionalEndpoint}`, {
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
          serverParams.forEach((param) => {
            resource[param] = data[param]
          })
        } else if (id.length === 4) {
          model.patchListFromServer(data.tasks, id[0])
        }
        resolve()
      })
    }).catch(reject)
  })
}
export const deleteItem = (id, endpoint, model, parentModel, arrayParam) => {
  const additionalEndpoint = '/' + id[1] + '/'
  const finalDeletions = id[2].map(item => item[1])
  return fetch(`${config.endpoint}/${endpoint}${additionalEndpoint}`, {
    method: 'DELETE',
    headers: authenticationStore.authHeader(true),
    body: JSON.stringify({
      [arrayParam]: finalDeletions
    })
  }).then(checkStatus)
}
export const deleteItems = (items, endpoint, model, parentModel, arrayParam) => {
  const finalDeletions = items.map(item => item[1])      
  return fetch(`${config.endpoint}/${endpoint}`, {
    method: 'DELETE',
    headers: authenticationStore.authHeader(true),
    body: JSON.stringify({
      [arrayParam]: finalDeletions
    })
  }).then(checkStatus)
} 

export const archiveItem = (item, endpoint, model, parentModel) => {
  const listId = parentModel.find(item[0]).serverId
  // const taskId = item[1].map(i => this.model.find(i).serverId)

  return fetch(`${config.endpoint}/archive/${listId}`, {
    method: 'POST',
    headers: authenticationStore.authHeader(true),
    body: JSON.stringify({
      tasks: item[1]
    })
  }).then(checkStatus)
}