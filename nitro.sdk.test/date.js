import assert from 'assert'
import { formatDate } from '../nitro.ui/helpers/date.js'

describe('dates', function() {
  describe('formatDate', function() {
    // because 3am is the cut off in nitro.
    const currentDate = new Date()
    if (currentDate.getHours() <= 3) {
      currentDate.setDate(currentDate.getDate() - 1)
    }

    it('should convert a date to month and date format', function() {
      assert.equal(formatDate(new Date(0), 'task'), 'Jan 1')
      assert.equal(formatDate(new Date(100000000), 'task'), 'Jan 2')
    })
    it('should show things with dates set today', function() {
      assert.equal(
        formatDate(new Date(currentDate.getTime()), 'task', 'today'),
        'Today'
      )
    })
  })
})
