import config from '../config.js'
import assert from 'assert'
import authenticationStore from '../source/js/stores/auth.js'
import { CombinedCollection } from '../source/js/models/combinedCollection.js'

describe('syncGet', function() {
	describe('lists', function() {
		const createList = function() {
			return fetch(config.endpoint + '/lists', {
				method: 'POST',
				headers: authenticationStore.authHeader(true),
				body: JSON.stringify({ name: 'A Cool List', id: Math.random() })
			})
		}
		const patchList = function(id) {
			return fetch(config.endpoint + '/lists/' + id, {
				method: 'PATCH',
				headers: authenticationStore.authHeader(true),
				body: JSON.stringify({ name: 'A modified list.', updatedAt: new Date()})
			})
		}
		const checkUpdates = function(updates) {
			return CombinedCollection.syncGet.downloadLists().then(function(data) {
				assert.equal(data.new.length, updates[0])
				assert.equal(data.updates.length, updates[1])
				assert.equal(data.localdelete.length, updates[2])
				return data
			})
		}
		let newData = null
		let dataId = null
		let dataId2 = null
		describe('download', function() {
			it('testrunner should create some test lists', function(done) {		
				const promises = [createList(), createList()]
				Promise.all(promises).then(function() {
					done()
				})
			})
			it('client should have new lists to download', function(done) {
				CombinedCollection.syncGet.downloadLists().then(function(data) {
					assert.equal(data.new.length, 2)
					assert.equal(data.updates.length, 0)
					assert.equal(data.localdelete.length, 0)
					dataId = data.new[0]
					dataId2 = data.new[1]
					newData = data
					done()
				}).catch(done)
			})
			it('client should save those new lists from the server', function(done) {
				CombinedCollection.syncGet.updateLocal(newData).then(function() {
					done()
				})
			})
			it('client should have no new changes from the server', function(done) {
				checkUpdates([0,0,0]).then(()=>{done()}).catch(done)
			})
		})

		describe('update', function() {
			it('testrunner should patch a list', function(done) {
				patchList(dataId).then(function() {
					patchList(dataId2).then(function() {
						done()
					}).catch(done)
				}).catch(done)
			})
			it('client should have new lists to update', function(done) {
				checkUpdates([0,2,0]).then(function(data) {
					newData = data
					done()
				}).catch(done)
			})
			it('client should apply those updates from the server', function(done) {
				CombinedCollection.syncGet.updateLocal(newData).then(function() {
					done()
				})
			})
			it('client should have no new changes from the server', function(done) {
				checkUpdates([0,0,0]).then(()=>{done()}).catch(done)
			})
		})
		describe('download & update', function() {
			it('testrunner should create & patch a list', function(done) {
				createList().then(function() {
					patchList(dataId2).then(function() {
						done()
					}).catch(done)
				}).catch(done)
			})

			it('client should have new lists to download & update', function(done) {
				checkUpdates([1,1,0]).then(function(data) {
					newData = data
					done()
				}).catch(done)
			})
			it('client should apply those downloads & updates from the server', function(done) {
				CombinedCollection.syncGet.updateLocal(newData).then(function() {
					done()
				})
			})
			it('client should have no new changes from the server', function(done) {
				checkUpdates([0,0,0]).then(()=>{done()}).catch(done)
			})
		})
		describe('delete', function() {
			it('testrunner should delete a list', function(done) {
				fetch(config.endpoint + '/lists/', {
					method: 'DELETE',
					headers: authenticationStore.authHeader(true),
					body: JSON.stringify({lists: [dataId, dataId2]})
				}).then(() => {done()}).catch(done)
			})
			it('client should have new lists to delete', function(done) {
				checkUpdates([0,0,2]).then(function(data) {
					newData = data
					done()
				}).catch(done)
			})
			it('client should apply those deletes from the server', function(done) {
				CombinedCollection.syncGet.updateLocal(newData).then(function() {
					done()
				})
			})
			it('client should have no new changes from the server', function(done) {
				checkUpdates([0,0,0]).then(()=>{done()}).catch(done)
			})
		})
	})
})