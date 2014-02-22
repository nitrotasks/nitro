# Load librariess
libs = require '../vendor/libs'

# Base
Base = require 'base'
Base.touchify = require '../utils/touchify'

# Utilities
translate = require '../utils/translate'
event     = require '../utils/event'
Mouse     = require '../utils/mouse'

# Models
Task    = require '../models/task'
List    = require '../models/list'
Pref    = require '../models/pref'
User    = require '../models/user'

# Controllers
Sync          = require '../controllers/sync'
# Pro           = require # '../controllers/pro'
Auth          = require '../controllers/auth'
Search        = require '../controllers/search'

# Views
Keys  = require '../views/keys'
Views = require '../controllers/views'

class App

  constructor: ->

    Pref.once 'refresh', =>
      console.log 'Loaded prefs'
      @prefReady = true
      @syncWithServer()

    User.once 'refresh', =>
      console.log 'Loaded user'
      @userReady = true
      @syncWithServer()

    event.on 'app:offline', ->
      # Load data from disk
      Task.trigger 'fetch'
      List.trigger 'fetch'

    # Load Pref
    Pref.trigger 'fetch'
    User.trigger 'fetch'

  syncWithServer: =>

    return if @started or not (@prefReady and @userReady)
    @started = true

    auth = new Auth()

    @ready()

    # Login to sync
    if User.authenticated
      console.log 'going to connect to the server'
      auth.socket()

    else
      console.log 'we are offline'
      event.trigger 'app:offline'


  ready: =>

    console.log 'running ready'

    # Load translations
    translate.init()

    # Load controllers
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

    return if @displayed or not (@listReady and @taskReady)
    @displayed = true

    Views.loadLists()

    # Doesn't run in the Pref constructor. Bit of a pain
    # TODO: Move somewhere else?
    # if Pref.moveCompleted is 1
      # Pref.moveCompleted()

    event.trigger 'app:ready'

module.exports = App
