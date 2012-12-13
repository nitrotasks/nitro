require('lib/setup')
Spine = require('spine')

# Models
Task  = require('models/task')
List  = require('models/list')
Setting = require('models/setting')

# Controllers
Tasks = require('controllers/tasks')
Lists = require('controllers/lists')
ListTitle = require('controllers/lists.title')
Panel = require('controllers/panel')
Settings = require("controllers/settings")

class App extends Spine.Controller

  elements:
    '.tasks': 'tasksContainer'
    '.sidebar': 'listsContainer'
    '.tasks .title': 'listTitle'
    'header': 'panel'
    '.settings': 'settings'

  constructor: ->
    super

    # Load settings
    Setting.fetch()
    if Setting.count() is 0
      Setting.create()

    # Init panel
    new Panel
      el: @panel

    # Init settings
    window.settings = new Settings
      el: @settings

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

    # Login to sync
    Spine.Sync.login(Setting.first().username)

module.exports = App
