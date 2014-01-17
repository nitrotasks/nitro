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


  describe 'List Model', ->

    it 'should create a list', ->

      list = List.create
        id: 'c0'
        name: 'Chicken'
        tasks: []

      list.id.should.equal 'c0'
      list.name.should.equal 'Chicken'
      list.tasks.should.be.an.instanceOf Task.Collection

    it 'should move a task between lists', ->

      list1 = List.create()
      list2 = List.create()

      task = Task.create listId: list1.id

      list1.tasks.length.should.equal 1
      list1.tasks.exists(task).should.equal true
      list2.tasks.length.should.equal 0
      list2.tasks.exists(task).should.equal false

      list1.moveTask task, list2

      list1.tasks.length.should.equal 0
      list1.tasks.exists(task).should.equal false
      list2.tasks.length.should.equal 1
      list2.tasks.exists(task).should.equal true

    it 'should remove completed tasks', ->

      list = List.create()

      task1 = Task.create listId: list.id, completed: 0
      task2 = Task.create listId: list.id, completed: 1
      task3 = Task.create listId: list.id, completed: 1
      task4 = Task.create listId: list.id, completed: 1
      task5 = Task.create listId: list.id, completed: 0

      list.tasks.length.should.equal 5

      list.moveCompleted()

      list.tasks.length.should.equal 2


  describe 'List Collection', ->
