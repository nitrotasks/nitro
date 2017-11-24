import assert from 'assert'

import { CombinedCollection } from '../source/js/models/combinedCollection.js'
import { getToday, getNext } from '../source/js/models/magicList.js'

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
    assert.equal(getToday(false)[compare].name, 'task' + num)
  }
}
const ass2 = (num, compare = num) => {
  return () => {
    assert.equal(getNext(false)[compare].name, 'task' + num)
  }
}

describe('magic lists', function() {
  describe('today', function() {
    it('should not show any tasks if there are no due dates or deadlines', function() {
      assert.equal(getToday(false).length, 0)
    })
    it('the testrunner should create all the tasks in priority order', function() {
      // this creates in priority,order, tests below verify this
      a({deadline: createDate(14), date: createDate(14)})
      a({deadline: createDate(20)})
      a({deadline: createDate(9)})
      a({deadline: createDate(7), date: createDate(14)})
      a({deadline: createDate(7), date: createDate(0)})
      a({deadline: createDate(7), date: createDate(-5)})
      a({deadline: createDate(7), completed: createDate(0)})
      a({completed: createDate(2)})
      a()
      assert.equal(tasks.length, 9)
    })
    it('should have all the correct tasks in the today list', function() {
      tasks = tasks.reverse()
      tasks.forEach(task => CombinedCollection.addTask(task))
      assert.equal(getToday(false).length, 7)
    })
    describe('deadline, overdue', function() {
      it('0: overdue deadline + overdue date', ass(0))
      it('1: overdue deadline, but more than 2 weeks', ass(1))
      it('2: day in deadline has more weighting than day in date', ass(2))
      it('3: dates weigh deadlines more', ass(3))
      it('4: more overdue dates weigh deadlines more', ass(4))
      it('5: deadline with date not overdue weighed more than date', ass(5))
      it('6: completed should show up if it is less than a day ago', ass(6))
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
        assert.equal(getToday(false).length, 11)
      })
      it('0: overdue date is about half as weighted as overdue deadline', ass(0, 6))
      it('1: overdue date more weighted with a deadline', ass(1, 8))
      it('2: overdue date more overdue is less than with a deadline', ass(2, 9))
      it('3: overdue date weighted by days overdue', ass(3, 10))
    })
  })
  describe('next', function() {
    const offset = 11
    it('should have the tasks from today, but not tasks without dates or deadlines', function() {
      assert.equal(getNext(false).length, offset)
    })
    it('the testrunner should create all the tasks in priority order', function() {
      tasks = []
      a({deadline: createDate(-1), date: createDate(-1)})
      a({deadline: createDate(-1)})
      a({date: createDate(-1)})
      a({deadline: createDate(-4)})
      a({deadline: createDate(-9), date: createDate(-1)})
      a({deadline: createDate(-8), date: createDate(-5)})
      a({deadline: createDate(-9), date: createDate(-5)})
      a({deadline: createDate(-9), type: 'next'})
      a({date: createDate(-26)})
      a({type: 'next'})
      assert.equal(tasks.length, 10)
    })
    it('should have all the correct tasks in the next list', function() {
      tasks = tasks.reverse()
      tasks.forEach(task => CombinedCollection.addTask(task))
      assert.equal(getNext(false).length, 10 + offset)
    })
    it('should have not modified the today list', function() {
      assert.equal(getToday(false).length, offset)
    })
    describe('deadline + date', function() {
      it('0: due soon with a date soon is most important', ass2(0, offset+0))
      it('1: due on same date without a do date is less important', ass2(1, offset+1))
      it('2: date has some weighting, depends on days', ass2(2, offset+2))
      it('3: deadline has some weighting, depends on days', ass2(3, offset+3))
      it('4: same deadline, closer date has more weighting', ass2(4, offset+4))
      it('5: same date, closer deadline has more weighting', ass2(5, offset+5))
      it('6: comparison to 4 & 5', ass2(6, offset+6))
      it('7: deadline + next still has weighting', ass2(7, offset+7))
      it('8: 14 days is max date', ass2(8, offset+8))
      it('9: next is still weighted least', ass2(9, offset+9))
    })
  })
})