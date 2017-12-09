import assert from 'assert'

import { CombinedCollection } from '../source/js/models/combinedCollection.js'

describe('combined collection', function() {
  before(function(done) {
    CombinedCollection.loadData().then(() => {
      done()
    })
  })
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
    it('should be able to update a list', function() {
      CombinedCollection.updateList(newId, {name: 'new name'})
      const list = CombinedCollection.getList(newId)
      assert.equal(list.name, 'new name')
    })
    it('should not be able to update to a system list', function() {
      CombinedCollection.updateList(newId, {name: 'nitrosys-whatever'})
      const list = CombinedCollection.getList(newId)
      assert.equal(list.name, 'whatever')
    })
    it('should not be able to change the name of a system list', function() {
      CombinedCollection.updateList('inbox', {name: 'what'})
      const list = CombinedCollection.getList('inbox')
      assert.notEqual(list.name, 'what')
    })
    it('should not be able to update a list that does not exist', function() {
      assert.throws(() => {
        CombinedCollection.updateList('notreal', {name: 'whatever'})
      }, Error)
    })
    it('should be able to delete a list', function() {
      CombinedCollection.deleteList(newId)
      const list = CombinedCollection.getList(newId)
      assert.equal(list, null)
    })
    it('should not be able to delete a list that does not exist', function() {
      assert.throws(() => {
        CombinedCollection.deleteList('not exist')
      }, Error)
    })
    it('should not be able to delete a system list', function() {
      assert.throws(() => {
        CombinedCollection.deleteList('inbox')
      }, Error)
    })
  })
  describe('task', function() {
    it('requires a list to create a task', function() {
      assert.throws(() => {
        CombinedCollection.addTask({ name: 'A task' })
      }, Error)
    })
    let taskId = null
    it('should be able to create a task', function() {
      const task = CombinedCollection.addTask({ name: 'A task', list: 'inbox' })
      taskId = task.id
    })
    it('adding a task in today should add in inbox, with date', function() {
      const task = CombinedCollection.addTask({ name: 'A task', list: 'today' })
      const retrieved = CombinedCollection.getTask(task.id)
      assert.equal(retrieved.list, 'inbox')
      assert.notEqual(retrieved.date, null)
      CombinedCollection.deleteTask(task.id)
    })
    it('adding a task in next should add in inbox, with type', function() {
      const task = CombinedCollection.addTask({ name: 'A task', list: 'next' })
      const retrieved = CombinedCollection.getTask(task.id)
      assert.equal(retrieved.list, 'inbox')
      assert.equal(retrieved.type, 'next')
      CombinedCollection.deleteTask(task.id)
    })
    it('should be able to get a task', function() {
      const task = CombinedCollection.getTask(taskId)
      assert.notEqual(task, null)
    })
    it('should not be able to get a task that does not exist', function() {
      const task = CombinedCollection.getTask('notexist')
      assert.equal(task, null)
    })
    it('should be able to get all the tasks in a list', function() {
      const tasks = CombinedCollection.getTasks('inbox')
      assert.equal(tasks.tasks.length, 1)
      assert.equal(tasks.order.length, 1)
    })
    let newTask2
    it('should be able to get all the tasks in a magic list', function() {
      newTask2 = CombinedCollection.addTask({ name: 'A task', list: 'inbox', date: new Date(0) })
      const tasks = CombinedCollection.getTasks('today')
      assert.equal(tasks.tasks.length, 1)
      assert.equal(tasks.order.length, 1)
    })
    it('should return null for a list that does not exist', function() {
      const tasks = CombinedCollection.getTasks('boop')
      assert.equal(tasks, null)
    })
    it('should be able to update a task', function() {
      CombinedCollection.updateTask(taskId, { name: 'new name' })
      const task = CombinedCollection.getTask(taskId)
      assert.equal(task.name, 'new name')
    })
    it('should not be able to update a task that does not exist', function() {
      assert.throws(() => {
        CombinedCollection.updateTask('notexist', { name: 'A task' })
      }, Error)
    })
    it('should be able to complete a task', function() {
      CombinedCollection.completeTask(taskId)
      const task = CombinedCollection.getTask(taskId)
      assert.notEqual(task.completed, null)
    })
    it('should be able to uncomplete a task', function() {
      CombinedCollection.completeTask(taskId)
      const task = CombinedCollection.getTask(taskId)
      assert.equal(task.completed, null)
    })
    it('should be able to delete a task', function() {
      CombinedCollection.deleteTask(taskId)
      assert.equal(CombinedCollection.getTask(taskId), null)
      assert.equal(CombinedCollection.getList('inbox').localOrder.length, 1)
    })
    it('should not be able to delete a task that does not exist', function() {
      assert.throws(() => {
        CombinedCollection.deleteTask('notexist')
      }, Error)
    })
    it('should be able to archive a task', function(done) {
      CombinedCollection.archiveTask(newTask2.id).then(() => {
        assert.equal(CombinedCollection.getTask(newTask2.id), null)
        assert.equal(CombinedCollection.getList('inbox').localOrder.length, 0)
        done()
      })
    })
  })
})
