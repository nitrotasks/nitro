require('lib/setup')
Spine = require('spine')
Task  = require('models/task')
List  = require('models/list')
Settings = require("models/settings")
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

    # Load settings
    Settings.fetch()
    if Settings.count() is 0
      Settings.create()

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
