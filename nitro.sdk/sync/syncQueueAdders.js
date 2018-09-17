import { log, warn } from '../helpers/logger.js'

const findQueueIndex = function(item) {
  return function(element) {
    return element[1] === item
  }
}

export const postQueue = function(id, queue, identifier) {
  log(identifier, 'POST Requested')
  // batches the objects together
  if (typeof id === 'object') {
    const index = queue.post.findIndex(function(element) {
      return element[0] === id[0]
    })
    if (index > -1) {
      queue.post[index][1].push(id[1])
    } else {
      queue.post.push([id[0], [id[1]]])
    }
  } else {
    queue.post.push(id)
  }
}

export const patchQueue = function(id, queue, identifier, model, parentModel) {
  log(identifier, 'PATCH Requested')
  // this is for tasks, so we look at the parent model
  if (typeof id === 'object') {
    const listServerId = parentModel.find(id[0]).serverId
    const taskServerId = model.find(id[1]).serverId

    // I realize this is duplicated logic, but it's a bit easier to work with in my head.
    if (!listServerId) {
      return log(identifier, 'Skipping PATCH - Parent still in POST queue')
    }
    if (!taskServerId) {
      return log(identifier, 'Skipping PATCH - Still in POST Queue')
    }

    const index = queue.patch.findIndex(function(element) {
      return element[0] === id[0]
    })
    // rev the queue details
    if (index > -1) {
      // if it's already in there, just rev the time
      const taskIndex = queue.patch[index][2].findIndex(function(element) {
        return element[0] === id[1]
      })
      if (taskIndex > -1) {
        log(identifier, 'Skipping PATCH Queue - Updating Time')
        queue.patch[index][2][taskIndex][2] = new Date().toISOString()
      } else {
        log(identifier, 'Adding PATCH to previous queue.')
        queue.patch[index][2].push([
          id[1],
          taskServerId,
          new Date().toISOString()
        ])
      }
    } else {
      log(identifier, 'Adding PATCH Queue.')
      queue.patch.push([
        id[0],
        listServerId,
        [[id[1], taskServerId, new Date().toISOString()]],
        new Date().toISOString()
      ])
    }
  } else {
    const serverId = model.find(id).serverId
    if (!serverId) {
      log(identifier, 'Skipping PATCH Request - Still in POST queue.')
    } else if (queue.patch.find(findQueueIndex(serverId))) {
      log(identifier, 'Skipping PATCH Request - Updating Time')
      queue.patch.find(findQueueIndex(serverId))[2] = new Date().toISOString()
    } else {
      // includes the last updated time
      queue.patch.push([id, serverId, new Date().toISOString()])
    }
  }
}

export const deleteQueue = function(id, queue, identifier, model, parentModel) {
  log(identifier, 'DELETE Requested')
  if (typeof id === 'object') {
    const deleteFromPostQueue = () => {
      queue.post = queue.post
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
      queue.patch = queue.patch
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
              log(identifier, 'DELETE forced removal from PATCH Queue')
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

    let listServerId = parentModel.find(id[0])
    if (listServerId !== null) listServerId = listServerId.serverId
    let taskServerId = model.find(id[1])
    if (taskServerId !== null) taskServerId = taskServerId.serverId

    const index = queue.delete.findIndex(function(element) {
      return element[0] === id[0]
    })

    if (!listServerId) {
      log(identifier, 'Skipping DELETE - Parent still in POST queue')
      deleteFromPostQueue()
    } else if (!taskServerId) {
      log(identifier, 'Skipping DELETE - Still in POST Queue')
      deleteFromPostQueue()
    } else if (index > -1) {
      const taskIndex = queue.delete[index][2].findIndex(function(element) {
        return element[0] === id[1]
      })
      if (taskIndex > -1) {
        log(identifier, 'Skipping DELETE Queue - Already in there')
      } else {
        log(identifier, 'Adding DELETE to previous queue.')
        queue.delete[index][2].push([id[1], taskServerId])
        deleteFromPatchQueue()
      }
    } else {
      log(identifier, 'Adding DELETE Queue.')
      queue.delete.push([id[0], listServerId, [[id[1], taskServerId]]])
      deleteFromPatchQueue()
    }
    model.actualDelete(id[1])
  } else {
    let serverId = model.find(id)
    if (serverId !== null) serverId = serverId.serverId
    if (serverId === null) {
      log(identifier, 'Skipping DELETE Request - Deleting from POST queue.')
      queue.post.splice(queue.post.indexOf(id), 1)
    } else if (queue.delete.find(findQueueIndex(serverId))) {
      log(identifier, 'Skipping DELETE Request - Already Added')
    } else {
      queue.delete.push([id, serverId])
    }
    model.actualDelete(id)
  }
}

export const archiveQueue = function(id, queue, identifier) {
  log(identifier, 'ARCHIVE Requested')
  if (typeof id[1] === 'string') {
    id[1] = [id[1]]
  }

  const index = queue.archive.findIndex(function(element) {
    return element[0] === id[0]
  })

  if (index > -1) {
    queue.archive[index][1] = queue.archive[index][1].concat(id[1])
  } else {
    queue.archive.push([id[0], id[1]])
  }
}

export const metaQueue = function(key, queue, identifier, model) {
  // Currently only supports order
  if (key !== 'list-order') {
    warn(key, 'META not supported!')
    return
  }

  log(key, 'META Requested')
  const serverOrder = model.order
    .map(i => model.find(i))
    .filter(i => !i.virtual)
    .map(i => i.serverId)

  if (serverOrder.includes(null)) {
    log('Not syncing list order - one or more lists are not synced.')
  } else {
    // removes existing order requests
    queue.meta = queue.meta.filter(i => i[0] !== 'list-order')
    queue.meta.push([key, serverOrder])
  }
}
