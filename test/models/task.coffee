require 'should'

Task = List = null

describe 'Task', ->

  before ->
    global.window = {}
    global.localStorage = {}
    Task = require '../../source/scripts/models/task'
    List = require '../../source/scripts/models/list'

  after ->
    delete global.window
    delete global.localStorage

  beforeEach ->
    Task.deleteAll()
    List.deleteAll()

  describe 'Task Model', ->

    it 'should create a new Task', ->

      now = new Date()

      task = Task.create
        listId: 's0'
        name: 'This is a task'
        date: now
        completed: now
        priority: 2
        notes: 'some notes'

      task.name.should.equal 'This is a task'
      task.listId.should.equal 's0'
      task.date.should.equal now
      task.completed.should.equal now
      task.priority.should.equal 2
      task.notes.should.equal 'some notes'

      Task.get(task.id).should.equal task


    it 'should make the date pretty', ->

      now = Date.now()
      task = Task.create(date: now)

      task.prettyDate().should.eql
        words: 'today'
        classname: 'due'

      task.date += 86400000

      task.prettyDate().should.eql
        words: 'tomorrow'
        classname: 'soon'

      task.date += 86400000

      task.prettyDate().should.eql
        words: 'in 2 days'
        classname: ''

      task.date += 86400000

      task.prettyDate().should.eql
        words: 'in 3 days'
        classname: ''

    it 'should get the list that it is in', ->

      list = List.create()

      task = Task.create
        listId: list.id

      task.listId.should.equal list.id
      task.list().should.equal list


  describe 'Task Collection', ->

    it 'should create a new collection', ->

      collection = new Task.Collection()

      # create some tasks
      task1 = collection.create()
      task2 = collection.create()
      task3 = collection.create()

      # Should be holding the tasks
      collection.length.should.equal 3
      collection.get(task1.id).should.equal task1
      collection.get(task2.id).should.equal task2
      collection.get(task3.id).should.equal task3

      # Tasks should not be added to the main collection
      Task.length.should.equal 0

    it 'should sort the tasks', ->

      collection = new Task.Collection()

      now = Date.now()

      task1 = collection.create
        completed: now
        priority: 1
        date: now
        name: 'apples'

      task2 = collection.create
        completed: 0
        priority: 2
        date: now + 20
        name: 'bananas'

      task3 = collection.create
        completed: now
        priority: 3
        date: now + 40
        name: 'cat'

      task4 = collection.create
        completed: 0
        priority: 1
        date: now
        name: 'zig'

      sorted = collection.sort()
      sorted.should.eql [task2, task4, task3, task1]

    it 'should auto add tasks from the main Tasks collection', ->

      list = List.create(id: 'my-list')

      task1 = Task.create(listId: list.id)
      task2 = Task.create(listId: list.id)
      task3 = Task.create(listId: list.id)

      Task.length.should.equal 3
      Task.get(task1.id).should.equal task1
      Task.get(task2.id).should.equal task2
      Task.get(task3.id).should.equal task3

      list.tasks.length.should.equal 3
      list.tasks.get(task1.id).should.equal task1
      list.tasks.get(task2.id).should.equal task2
      list.tasks.get(task3.id).should.equal task3

      # Destroy Task

      id = task1.id
      task1.destroy()

      Task.length.should.equal 2
      Task.exists(id).should.equal false

      list.tasks.length.should.equal 2
      list.tasks.exists(id).should.equal false

  describe 'Task Singleton', ->

    it 'should get all active tasks', ->

      task1 = Task.create completed: 0
      task2 = Task.create completed: 1
      task3 = Task.create completed: 0
      task4 = Task.create completed: 1
      task5 = Task.create completed: 0

      Task.active().should.eql [task1, task3, task5]

    it 'should get all completed tasks', ->

      task1 = Task.create completed: 0
      task2 = Task.create completed: 1
      task3 = Task.create completed: 0
      task4 = Task.create completed: 1
      task5 = Task.create completed: 0

      Task.completed().should.eql [task2, task4]

    it 'should get all tasks in a list', ->

      task1 = Task.create listId: 's0'
      task2 = Task.create listId: 's1'
      task3 = Task.create listId: 's2'
      task4 = Task.create listId: 's1'
      task5 = Task.create listId: 's0'

      Task.list('s0').should.eql [task1, task5]
      Task.list('s1').should.eql [task2, task4]
      Task.list('s2').should.eql [task3]
      Task.list('s3').should.eql []

    it 'should search through tasks', ->

      task1 = Task.create name: 'a b c'
      task2 = Task.create name: 'b c d'
      task3 = Task.create name: 'c d e'
      task4 = Task.create name: 'd e a'
      task5 = Task.create name: 'e a b'

      Task.search('').should.eql [task1, task2, task3, task4, task5]
      Task.search(' ').should.eql [task1, task2, task3, task4, task5]

      Task.search('a').should.eql [task1, task4, task5]
      Task.search('a b').should.eql [task1, task5]
      Task.search('b a').should.eql [task1, task5]
      Task.search('c b a').should.eql [task1]
      Task.search('e b').should.eql [task5]

      Task.search('x').should.eql []
      Task.search('abc').should.eql []

    it 'should match tags', ->

      task1 = Task.create name: '#tag is #this'
      task2 = Task.create name: 'this is a #TAG'
      task3 = Task.create name: 'not #Quite a tag'
      task4 = Task.create name: '#this is not the #tagging you are looking for'
      task5 = Task.create name: 'such#tag is awesome'

      Task.tag('tag').should.eql [task1, task2, task5]
      Task.tag('this').should.eql [task1, task4]
      Task.tag('quite').should.eql [task3]
      Task.tag('wat').should.eql []
