import assert from 'assert'

import { CombinedCollection } from '../source/js/models/combinedCollection.js'

describe('combined', function() {
  describe('list', function() {
    it('should have the default lists', function() {
      const lists = CombinedCollection.getLists()
      assert.equal(lists.length, 4)
    })
    it('should have the count attribute', function() {
      const lists = CombinedCollection.getLists()
      assert.equal(lists[0].count, 0)
    })
    it('should be able to get a list', function() {
      const list = CombinedCollection.getList('inbox')
      assert.notEqual(list, null)
    })
    it('should be not be able to get a list that does not exist', function() {
      const list = CombinedCollection.getList('notexist')
      assert.equal(list, null)
    })
    it('should not have the system name showing', function() {
      const list = CombinedCollection.getList('inbox')
      assert.notEqual(list.name, 'nitrosys-inbox')
    })
    let newId = null
    it('should be able to add a list', function() {
      const newlist = CombinedCollection.addList({ name: 'yo' })
      newId = newlist.id
      const list = CombinedCollection.getList(newId)
      assert.notEqual(list, null)
    })
    it('should be able to delete a list', function() {
      CombinedCollection.deleteList(newId)
      const list = CombinedCollection.getList(newId)
      assert.equal(list, null)
    })
  })
  describe('task', function() {
    it('requires a list to create a task', function() {
      assert.throws(() => {
        CombinedCollection.addTask({name: 'A task'})
      }, Error)
    })
    let taskId = null
    it('should be able to create a task', function() {
      const task = CombinedCollection.addTask({name: 'A task', list: 'inbox'})
      taskId = task.id
    })
    it('should be able to get a task', function() {
      const task = CombinedCollection.getTask(taskId)
      assert.notEqual(task, null)
    })
    it('should not be able to get a task that does not exist', function() {
      const task = CombinedCollection.getTask('notexist')
      assert.equal(task, null)
    })
  })
})
