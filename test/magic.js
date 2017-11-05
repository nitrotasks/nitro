import assert from 'assert'

import { CombinedCollection } from '../source/js/models/combinedCollection.js'
import { getToday } from '../source/js/models/magicList.js'

const createDate = (days) => {
  let date = new Date()
  date.setSeconds(date.getSeconds() - 1)
  date.setDate(date.getDate() - days)
  return date
}

let tasks = []
const a = (props) => {
  tasks.push(
    Object.assign({
      name: 'task' + tasks.length,
      list: 'inbox'
    }, props)
  )
}
const ass = (num, compare = num) => {
  return () => {
    assert.equal(getToday()[compare].name, 'task' + num)
  }
}

describe('magic lists', function() {
  describe('today', function() {
    it('should not show any tasks if there are no due dates or deadlines', function() {
      assert.equal(getToday().length, 0)
    })
    describe('deadline, overdue', function() {
      it('the testrunner should create all the tasks in priority order', function() {
        // this creates in priority,order, tests below verify this
        a({deadline: createDate(14), date: createDate(14)})
        a({deadline: createDate(20)})
        a({deadline: createDate(9)})
        a({deadline: createDate(7), date: createDate(14)})
        a({deadline: createDate(7), date: createDate(0)})
        a({deadline: createDate(7), date: createDate(-5)})
        a({deadline: createDate(7)})
        a()
        assert.equal(tasks.length, 8)
      })
      it('should have all the correct tasks in the today list', function() {
        tasks = tasks.reverse()
        tasks.forEach(task => CombinedCollection.addTask(task))
        assert.equal(getToday().length, 7)
      })
      it('0: overdue deadline + overdue date', ass(0))
      it('1: overdue deadline, but more than 2 weeks', ass(1))
      it('2: day in deadline has more weighting than day in date', ass(2))
      it('3: dates weigh deadlines more', ass(3))
      it('4: more overdue dates weigh deadlines more', ass(4))
      it('5: deadline with date not overdue weighed more than date', ass(5))
      it('6: deadline no date weighed less than date not overdue', ass(6))
    })
    describe('date, overdue', function() {
      it('the testrunner should create all the tasks in priority order', function() {
        tasks = []
        a({date: createDate(14)})
        a({date: createDate(6), deadline: createDate(-7)})
        a({date: createDate(7)})
        a({date: createDate(0)})
        assert.equal(tasks.length, 4)
      })
      it('should have all the correct tasks in the today list', function() {
        tasks = tasks.reverse()
        tasks.forEach(task => CombinedCollection.addTask(task))
        assert.equal(getToday().length, 11)
      })
      it('0: overdue date is about half as weighted as overdue deadline', ass(0, 2))
      it('1: overdue date more weighted with a deadline', ass(1, 5))
      it('2: overdue date more overdue is less than with a deadline', ass(2, 9))
      it('3: overdue date weighted by days overdue', ass(3, 10))
    })
  })
})