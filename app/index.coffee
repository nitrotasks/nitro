require('lib/setup')
Spine = require('spine')
Task  = require('models/task')
List  = require('models/list')
Tasks = require('controllers/tasks')
Lists = require('controllers/lists')

class App extends Spine.Controller

  elements:
    '.tasks': 'tasksContainer'
    '.sidebar': 'listsContainer'

  constructor: ->
    super

    # Init tasks
    @tasks = new Tasks( el: @tasksContainer )

    # Init lists
    @lists = new Lists( el: @listsContainer )

    # Load data for localStorage
    Task.fetch()
    List.fetch()

    # Select the first list on load
    @lists.showInbox()

module.exports = App
