# Load librariess
libs = require '../vendor/libs'

# Base
Base = require 'base'
Base.touchify = require '../utils/touchify'
$ = require 'jqueryify'

# Utilities
Keys      = require '../utils/keys'
translate = require '../utils/translate'
event     = require '../utils/event'
Mouse     = require '../utils/mouse'

# Models
Task    = require '../models/task'
List    = require '../models/list'
Setting = require '../models/setting'
User    = require '../models/user'

# Controllers
# Panel         = require # '../controllers/panel'
# Sync          = require # '../controllers/sync'
# Pro           = require # '../controllers/pro'
Auth          = require '../controllers/auth'
Search        = require '../controllers/search'

# Views
Modal         = require '../views/modal'
Tab           = require '../views/settings_tab'
Keys          = require '../views/keys'
LoadingScreen = require '../views/loading_screen'
Lists         = require '../views/lists'
Title         = require '../views/title'
ListButtons   = require '../views/list_buttons'
Tasks         = require '../views/tasks'
Settings      = require '../views/settings'
NightMode     = require '../views/night'

# Special Lists
# TODO: put these in another file
ListInbox     = require '../views/list/inbox'
ListAll       = require '../views/list/all'
ListCompleted = require '../views/list/completed'

class App

  constructor: ->

    # Load Settings
    Setting.trigger 'fetch'
    User.trigger 'fetch'

    # Load translations
    translate.init()

    # Load controllers
    new Auth()
    new Search()

    if User.loggedIn()
      User.trigger 'login', animate: false

    # Load Views
    new Lists()
    new Tasks()
    new Title()
    new ListButtons()
    new LoadingScreen()
    new Settings()
    new NightMode()

    # Load views
    @keys = new Keys()
    Mouse.init()

    # Init Modals
    Modal.init()
    Tab.init()

    # Load data from disk
    Task.trigger 'fetch'
    List.trigger 'fetch'

    # Load default lists and tasks
    # if Task.length is 0
    #     List.refresh require '../models/default/list.json'
    #     Task.refresh require '../models/default/task.json'

    # Make sure inbox list exists
    # TODO: Move somewhere elese
    if List.exists('inbox') is false
      List.create
        id: 'inbox'
        name: translate 'Inbox'
        permanent: yes

    # Load inbox
    inbox = List.get 'inbox'
    new ListInbox list: inbox
    inbox.trigger 'select'

    # Load other special lists
    new ListAll()
    new ListCompleted()

    # Doesn't run in the Settings constructor. Bit of a pain
    # TODO: Move somewhere else?
    # if Setting.completedDuration is 'day'
      # Settings.moveCompleted()

    # Select the first list on load
    # @lists.showInbox()

    # Login to sync
    if Setting.loggedin
      Sync.connect(Setting.uid, Setting.token)
    else
      event.trigger 'app:offline'

    event.trigger 'app:ready'

module.exports = App

