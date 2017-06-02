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
						} else {
							gets.push(item.id)
						}
						delete mapper[item.id]
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
}