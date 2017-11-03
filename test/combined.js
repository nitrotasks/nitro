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
    it('should not have the system name showing', function() {
      const list = CombinedCollection.getList('inbox')
      assert.notEqual(list.name, 'nitrosys-inbox')
    })
  })
})