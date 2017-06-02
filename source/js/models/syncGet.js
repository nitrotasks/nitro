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
							gets.push(item.id)
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
					this.lists.add(data, false)

					// TODO: copy the task data in

					// goes to next list, or resolves
					serverIdArray.splice(0,1)
					if (serverIdArray.length > 0) {
						downloadList(done)
					} else {
						done()
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
	downloadPartialLists(serverIdArray) {
		const downloadList = (done) => {
			const serverId = serverIdArray[0]
			fetch(`${config.endpoint}/lists/${serverId}`, {
				headers: authenticationStore.authHeader(true)
			}).then(checkStatus).then((response) => {
				response.json().then((data) => {
					// creates a new list with no sync
					data.lastSync = data.updatedAt
					data.serverId = data.id
					this.lists.update(data.id, data, false)

					// TODO: copy the task data in

					// goes to next list, or resolves
					serverIdArray.splice(0,1)
					if (serverIdArray.length > 0) {
						downloadList(done)
					} else {
						done()
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
	updateLocal(data) {
		return new Promise((resolve, reject) => {
			const promises = [
				// handle new & updated lists
				this.downloadFullLists(data.new),
				this.downloadPartialLists(data.updates),
			]

			// handles deleted lists
			data.localdelete.forEach((localid) => {
				this.tasks.deleteAllFromList(localid)
				this.lists.collection.delete(localid)
			})
			this.lists.trigger('update')
    	this.lists.saveLocal()

    	// mostly this is just for the tests, but it's nice to have it resolve at once
    	Promise.all(promises).then(resolve)
		})
	}
}