import config from '../../../config.js'
import Events from './events.js'
import { checkStatus } from '../helpers/fetch.js'

import authenticationStore from '../stores/auth.js'

export default class SyncGet extends Events {
  constructor(props) {
    super(props)
    this.lists = props.lists
    this.tasks = props.tasks
  }
  downloadLists() { 
    return new Promise((resolve, reject) => {
      fetch(`${config.endpoint}/lists`, {
        headers: authenticationStore.authHeader(true)
      }).then(checkStatus).then((response) => {
        response.json().then((data) => {
          // allows for faster association for big arrays
          // by creating a hash table
          const mapper = {}
          this.lists.all().forEach(function(item) {
            if (item.serverId !== null) {
              mapper[item.serverId] = item.id
            }
          })

          // copies retrieved data onto localdata
          const gets = []
          const patches = []
          data.forEach((item) => {
            if (item.id in mapper) {
              // only adds them to the patch queue if they have been updated
              const listItem = this.lists.find(mapper[item.id])
              if(new Date(item.updatedAt) > new Date(listItem.lastSync)) {
                patches.push(item.id)  
              }
              delete mapper[item.id]
            } else {
              // their system list *should* be the first list,
              // but if it's not, we always want to prioritize it
              if (item.name.slice(0,9) === 'nitrosys-') {
                gets.unshift(item.id)
              } else {
                gets.push(item.id)
              }
            }
          })
          const deletes = Object.keys(mapper).map(function(key) {
            return mapper[key]
          })
          resolve({
            new: gets,
            updates: patches,
            localdelete: deletes
          })
        })
      }).catch((err) => {
        reject(err)
      })
    })
  }
  downloadFullLists(serverIdArray) {
    const downloadList = (done) => {
      const serverId = serverIdArray[0]
      fetch(`${config.endpoint}/lists/${serverId}/tasks`, {
        headers: authenticationStore.authHeader(true)
      }).then(checkStatus).then((response) => {
        response.json().then((data) => {
          // creates a new list with no sync
          data.lastSync = data.updatedAt
          data.serverId = data.id
          const newList = this.lists.add(data, false)

          // add the task data in
          this.tasks.addListFromServer(data.tasks, newList.id)

          // update the local order
          const localOrder = this.tasks.mapToLocal(newList.order)
          this.lists.update(newList.serverId, {localOrder: localOrder}, false)

          // goes to next list, or resolves
          serverIdArray.splice(0,1)
          if (serverIdArray.length > 0) {
            downloadList(done)
          } else {
            done()
          }
        })
      }).catch((err) => {
        console.error(err)
      })
    }
    return new Promise((resolve, reject) => {
      if (serverIdArray.length === 0) {
        resolve()
      } else {
        downloadList(resolve)
      }
    })
  }
  downloadPartialLists(serverIdArray) {
    const taskPromises = []
    const downloadList = (done) => {
      const serverId = serverIdArray[0]
      fetch(`${config.endpoint}/lists/${serverId}`, {
        headers: authenticationStore.authHeader(true)
      }).then(checkStatus).then((response) => {
        response.json().then((data) => {
          // creates a new list with no sync
          data.lastSync = data.updatedAt
          data.serverId = data.id
          // defer order update until tasks are downloaded
          const order = data.order
          delete data.order
          const list = this.lists.update(data.id, data, false)

          // copy the task data in
          taskPromises.push(this.downloadTasksForList(list, data.tasks).then(() => {
            // update the local order
            const localOrder = this.tasks.mapToLocal(order)
            this.lists.update(list.serverId, {localOrder: localOrder, order: order}, false)
          }))

          // goes to next list, or resolves
          serverIdArray.splice(0,1)
          if (serverIdArray.length > 0) {
            downloadList(done)
          } else {
            // resolves when all the tasks are downloaded
            Promise.all(taskPromises).then(function() {
              done()
            })
          }
        })
      }).catch((err) => {
        console.warn('offline?')
      })
    }
    return new Promise((resolve, reject) => {
      if (serverIdArray.length === 0) {
        resolve()
      } else {
        downloadList(resolve)
      }
    })
  }
  downloadTasksForList(list, simpleTasks) {
    const downloadTasks = (gets, patches) => {
      const getsMap = gets.map((item) => { return item.id })
      const patchesMap = patches.map((item) => { return item.id })
      const queryString = getsMap.concat(patchesMap).join(',')

      return new Promise((resolve, reject) => {
        if (queryString.length === 0) {
          return resolve()
        }
        fetch(`${config.endpoint}/lists/${list.serverId}?tasks=${queryString}`, {
          headers: authenticationStore.authHeader(true)
        }).then(checkStatus).then((response) => {
          response.json().then((data) => {
            // maps data back out to get gets and patches
            const toAdd = []
            const toPatch = []
            data.forEach((blob) => {
              if (getsMap.indexOf(blob.id) > -1) {
                toAdd.push(blob)
              } else {
                toPatch.push(blob)
              }
            })
            // add the new tasks to the client
            this.tasks.addListFromServer(toAdd, list.id)
            this.tasks.patchListFromServer(toPatch, list.id)

            resolve()
          })
        }).catch(reject)
      })
    }
    return new Promise((resolve, reject) => {
      // compares the server tasks to the localTasks
      const mapper = new Map()
      this.tasks.findList(list.id, false).forEach(function(item) {
        if (item.serverId !== null) {
          mapper[item.serverId] = item
        }
      })
      const gets  = []
      const patches = []
      simpleTasks.forEach((task) => {
        if (task.id in mapper) {
          if(new Date(task.updatedAt) > new Date(mapper[task.id].lastSync)) {
            patches.push(task)
          }  
          delete mapper[task.id]
        } else {
          gets.push(task)
        }
      })

      // deletes the tasks that are no longer on server
      const deletes = Object.keys(mapper).map(function(key) {
        return mapper[key].id
      })
      this.tasks.deleteTasks(deletes)

      // resolves only once all the web requests are done
      downloadTasks(gets, patches).then(function() {
        resolve()
      }).catch(function(err) {
        console.log(err)
        reject()
      })
    })
  }
  updateLocal(data) {
    return new Promise((resolve, reject) => {
      const promises = [
        // handle new & updated lists
        this.downloadFullLists(data.new),
        this.downloadPartialLists(data.updates),
      ]

      // handles deleted lists
      data.localdelete.forEach((localid) => {
        this.tasks.deleteAllFromList(localid, false)
        this.lists.collection.delete(localid, false)
      })
      this.lists.trigger('update')
      this.lists.saveLocal()

      // mostly this is just for the tests, but it's nice to have it resolve at once
      Promise.all(promises).then(resolve)
    })
  }
}