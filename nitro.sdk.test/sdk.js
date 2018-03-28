import assert from 'assert'

import { NitroSdk } from '../nitro.sdk'

describe('combined collection', function() {
  before(function(done) {
    NitroSdk.loadData().then(() => {
      done()
    })
  })
  describe('list', function() {
    it('should have the default lists', function() {
      const lists = NitroSdk.getLists()
      assert.equal(lists.length, 4)
    })
    it('should have the count attribute', function() {
      const lists = NitroSdk.getLists()
      assert.equal(lists[0].count, 0)
    })
    it('should be able to get a list', function() {
      const list = NitroSdk.getList('inbox')
      assert.notEqual(list, null)
    })
    it('should be not be able to get a list that does not exist', function() {
      const list = NitroSdk.getList('notexist')
      assert.equal(list, null)
    })
    it('should not have the system name showing', function() {
      const list = NitroSdk.getList('inbox')
      assert.notEqual(list.name, 'nitrosys-inbox')
    })
    let newId = null
    it('should be able to add a list', function() {
      const newlist = NitroSdk.addList({ name: 'yo' })
      newId = newlist.id
      const list = NitroSdk.getList(newId)
      assert.notEqual(list, null)
    })
    it('should be able to update a list', function() {
      NitroSdk.updateList(newId, {name: 'new name'})
      const list = NitroSdk.getList(newId)
      assert.equal(list.name, 'new name')
    })
    it('should not be able to update to a system list', function() {
      NitroSdk.updateList(newId, {name: 'nitrosys-whatever'})
      const list = NitroSdk.getList(newId)
      assert.equal(list.name, 'whatever')
    })
    it('should not be able to change the name of a system list', function() {
      NitroSdk.updateList('inbox', {name: 'what'})
      const list = NitroSdk.getList('inbox')
      assert.notEqual(list.name, 'what')
    })
    it('should not be able to update a list that does not exist', function() {
      assert.throws(() => {
        NitroSdk.updateList('notreal', {name: 'whatever'})
      }, Error)
    })
    it('should be able to delete a list', function() {
      NitroSdk.deleteList(newId)
      const list = NitroSdk.getList(newId)
      assert.equal(list, null)
    })
    it('should not be able to delete a list that does not exist', function() {
      assert.throws(() => {
        NitroSdk.deleteList('not exist')
      }, Error)
    })
    it('should not be able to delete a system list', function() {
      assert.throws(() => {
        NitroSdk.deleteList('inbox')
      }, Error)
    })
  })
  describe('task', function() {
    it('requires a list to create a task', function() {
      assert.throws(() => {
        NitroSdk.addTask({ name: 'A task' })
      }, Error)
    })
    let taskId = null
    it('should be able to create a task', function() {
      const task = NitroSdk.addTask({ name: 'A task', list: 'inbox' })
      taskId = task.id
    })
    it('adding a task in today should add in inbox, with date', function() {
      const task = NitroSdk.addTask({ name: 'A task', list: 'today' })
      const retrieved = NitroSdk.getTask(task.id)
      assert.equal(retrieved.list, 'inbox')
      assert.notEqual(retrieved.date, null)
      NitroSdk.deleteTask(task.id)
    })
    it('adding a task in next should add in inbox, with a date', function() {
      const task = NitroSdk.addTask({ name: 'A task', list: 'next' })
      const retrieved = NitroSdk.getTask(task.id)
      assert.equal(retrieved.list, 'inbox')
      NitroSdk.deleteTask(task.id)
    })
    it('should be able to get a task', function() {
      const task = NitroSdk.getTask(taskId)
      assert.notEqual(task, null)
    })
    it('should not be able to get a task that does not exist', function() {
      const task = NitroSdk.getTask('notexist')
      assert.equal(task, null)
    })
    it('should be able to get all the tasks in a list', function() {
      const tasks = NitroSdk.getTasks('inbox')
      assert.equal(tasks.tasks.length, 1)
      assert.equal(tasks.order.length, 1)
    })
    let newTask2
    it('should be able to get all the tasks in a magic list', function() {
      newTask2 = NitroSdk.addTask({ name: 'A task', list: 'inbox', date: new Date(0) })
      const tasks = NitroSdk.getTasks('today')
      assert.equal(tasks.tasks.length, 1)
      assert.equal(tasks.order.length, 1)
    })
    it('should return null for a list that does not exist', function() {
      const tasks = NitroSdk.getTasks('boop')
      assert.equal(tasks, null)
    })
    it('should be able to update a task', function() {
      NitroSdk.updateTask(taskId, { name: 'new name' })
      const task = NitroSdk.getTask(taskId)
      assert.equal(task.name, 'new name')
    })
    it('should not be able to update a task that does not exist', function() {
      assert.throws(() => {
        NitroSdk.updateTask('notexist', { name: 'A task' })
      }, Error)
    })
    it('should be able to complete a task', function() {
      NitroSdk.completeTask(taskId)
      const task = NitroSdk.getTask(taskId)
      assert.notEqual(task.completed, null)
    })
    it('should be able to uncomplete a task', function() {
      NitroSdk.completeTask(taskId)
      const task = NitroSdk.getTask(taskId)
      assert.equal(task.completed, null)
    })
    it('should be able to delete a task', function() {
      NitroSdk.deleteTask(taskId)
      assert.equal(NitroSdk.getTask(taskId), null)
      assert.equal(NitroSdk.getList('inbox').localOrder.length, 1)
    })
    it('should not be able to delete a task that does not exist', function() {
      assert.throws(() => {
        NitroSdk.deleteTask('notexist')
      }, Error)
    })
    it('should be able to archive a task', function(done) {
      NitroSdk.archiveTask(newTask2.id).then(() => {
        assert.equal(NitroSdk.getTask(newTask2.id), null)
        assert.equal(NitroSdk.getList('inbox').localOrder.length, 0)
        done()
      })
    })
  })
  after(function() {
    NitroSdk.stopInterval()
  })
})
