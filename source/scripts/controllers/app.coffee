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
Sync          = require '../controllers/sync'
# Pro           = require # '../controllers/pro'
Auth          = require '../controllers/auth'
Search        = require '../controllers/search'
Inbox         = require '../controllers/inbox'

# Views
Keys  = require '../views/keys'
Views = require '../controllers/views'

class App

  constructor: ->

    Setting.once 'refresh', =>
      console.log 'Loaded settings'
      @settingsReady = true
      @syncWithServer()

    User.once 'refresh', =>
      console.log 'Loaded user'
      @userReady = true
      @syncWithServer()

    # Load Settings
    Setting.trigger 'fetch'
    User.trigger 'fetch'

  syncWithServer: =>

    return unless not @started and @settingsReady and @userReady
    @started = true

    @ready()

    # Login to sync
    if User.authenticated
      console.log 'going to connect to the server'
      Sync.connect()

    else
      console.log 'we are offline'
      event.trigger 'app:offline'

      # Load data from disk
      Task.trigger 'fetch'
      List.trigger 'fetch'


  ready: =>

    console.log 'running ready'

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

    List.once 'refresh', =>
      console.log 'Loaded lists'
      @listReady = true
      @displayData()

    Task.once 'refresh', =>
      console.log 'Loaded tasks'
      @taskReady = true
      @displayData()


  displayData: =>

    return unless not @displayed and @listReady and @taskReady
    @displayed = true

    # Load default lists and tasks
    # if Task.length is 0
    #     List.refresh require '../models/default/list.json'
    #     Task.refresh require '../models/default/task.json'

    # Show inbox
    Views.loadLists()
    List.get('inbox').trigger('select')

    # Doesn't run in the Settings constructor. Bit of a pain
    # TODO: Move somewhere else?
    # if Setting.completedDuration is 'day'
      # Settings.moveCompleted()

    event.trigger 'app:ready'

module.exports = App
