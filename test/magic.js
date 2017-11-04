import assert from 'assert'

import { CombinedCollection } from '../source/js/models/combinedCollection.js'
import { getToday } from '../source/js/models/magicList.js'

describe('magic lists', function() {
  let list1 = null
  let task1 = null
  let task2 = null
  before(function() {
    list1 = CombinedCollection.addList({name: 'Boop'})
    task1 = CombinedCollection.addTask({name: 'Task1', list: 'inbox'})
    task2 = CombinedCollection.addTask({name: 'Task2', list: list1.id})
  })
  describe('today', function() {
    it('should not show any tasks if there are no due dates or deadlines', function() {
      assert.equal(getToday().length, 0)
    })
    it('should show tasks marked with dates of today', function() {
      CombinedCollection.updateTask(task1.id, {date: new Date()})
      assert.equal(getToday().length, 1)
    })
  })
})