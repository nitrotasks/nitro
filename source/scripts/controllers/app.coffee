# Load librariess
libs = require '../vendor/libs'

# Base
Base = require 'base'
Base.touchify = require '../utils/touchify'
$ = require 'jqueryify'

# Utilities
translate = require '../utils/translate'
event     = require '../utils/event'
Mouse     = require '../utils/mouse'

# Models
Task    = require '../models/task'
List    = require '../models/list'
Setting = require '../models/setting'
User    = require '../models/user'

# Controllers
# Sync          = require # '../controllers/sync'
# Pro           = require # '../controllers/pro'
Auth          = require '../controllers/auth'
Search        = require '../controllers/search'

# Views
Keys  = require '../views/keys'
Views = require '../controllers/views'

class App

  constructor: ->

    Setting.once 'refresh', =>
      console.log 'Loaded settings'
      @settingsReady = true
      @ready()

    User.once 'refresh', =>
      console.log 'Loaded user'
      @userReady = true
      @ready()

    # Load Settings
    Setting.trigger 'fetch'
    User.trigger 'fetch'

  ready: =>

    return unless @settingsReady and @userReady

    # Load translations
    translate.init()

    # Load controllers
    new Auth()
    new Search()

    # Load utils
    Mouse.init()

    # Load views
    Views.load()

    # Load keyboard shortcuts
    new Keys()

    if User.loggedIn()
      User.trigger 'login', animate: false

    # Login to sync
    if Setting.loggedin
      Sync.connect(Setting.uid, Setting.token)
    else
      event.trigger 'app:offline'

    List.once 'refresh', =>
      console.log 'Loaded lists'
      @listReady = true
      @displayData()

    Task.once 'refresh', =>
      console.log 'Loaded tasks'
      @taskReady = true
      @displayData()

    # Load data from disk
    Task.trigger 'fetch'
    List.trigger 'fetch'

  displayData: =>

    return unless @listReady and @taskReady

    # Load default lists and tasks
    # if Task.length is 0
    #     List.refresh require '../models/default/list.json'
    #     Task.refresh require '../models/default/task.json'

    # Make sure inbox list exists
    # TODO: Move somewhere elese
    if List.exists('inbox') is false
      List.create
        id: 'inbox'
        name: 'Inbox'
        permanent: yes

    # Show inbox
    Views.loadLists()

    # Doesn't run in the Settings constructor. Bit of a pain
    # TODO: Move somewhere else?
    # if Setting.completedDuration is 'day'
      # Settings.moveCompleted()

    event.trigger 'app:ready'

module.exports = App

