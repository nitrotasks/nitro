require('lib/setup')
Spine = require('spine')
Task  = require('models/task')
List  = require('models/list')
Tasks = require('controllers/tasks')
Lists = require('controllers/lists')
ListTitle = require('controllers/lists.title')
Panel = require('controllers/panel')

class App extends Spine.Controller

  elements:
    '.tasks': 'tasksContainer'
    '.sidebar': 'listsContainer'
    '.tasks .title': 'listTitle'
    'header': 'panel'

  constructor: ->
    super

    # Init panel
    new Panel
      el: @panel

    # Init tasks
    @tasks = new Tasks( el: @tasksContainer )

    # Init lists
    @lists = new Lists( el: @listsContainer )
    new ListTitle
      el: @listTitle

    # Load data for localStorage
    Task.fetch()
    List.fetch()

    # Select the first list on load
    @lists.showInbox()

module.exports = App
