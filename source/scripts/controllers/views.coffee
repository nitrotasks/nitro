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
Panel         = require '../views/panel'

ListInbox     = require '../views/list/inbox'
ListAll       = require '../views/list/all'
ListCompleted = require '../views/list/completed'

views = {}

views.load = ->

  views.lists         = new Lists()
  views.tasks         = new Tasks()
  views.title         = new Title()
  views.listButtons   = new ListButtons()
  views.loadingScreen = new LoadingScreen()
  views.settings      = new Settings()
  views.nightMode     = new NightMode()
  views.panel         = new Panel()
  views.modal         = Modal
  views.tab           = Tab

  # Special views
  Modal.init()
  Tab.init()


views.loadLists = ->

  views.list =
    all: new ListAll()
    inbox: new ListInbox()
    completed: new ListCompleted()

module.exports = views
