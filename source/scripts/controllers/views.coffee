Modal         = require '../views/modal'
Tab           = require '../views/settings_tab'
Keys          = require '../views/keys'
LoadingScreen = require '../views/loading_screen'
Lists         = require '../views/lists'
Title         = require '../views/title'
ListMenu      = require '../views/list_menu'
Tasks         = require '../views/tasks'
Settings      = require '../views/settings'
NightMode     = require '../views/night'
Panel         = require '../views/panel'

ListInbox     = require '../views/list/inbox'
ListAll       = require '../views/list/all'
ListCompleted = require '../views/list/completed'

views = {}

views.load = ->

  views.loadingScreen = new LoadingScreen()

  views.lists         = new Lists()
  views.tasks         = new Tasks()
  views.title         = new Title()
  views.listMenu      = new ListMenu()

  views.tab           = Tab
  Tab.init()

  views.settings      = new Settings()
  views.nightMode     = new NightMode()

  views.panel         = new Panel()
  views.modal         = Modal
  Modal.init()


views.loadLists = ->

  views.list =
    all: new ListAll()
    inbox: new ListInbox()
    completed: new ListCompleted()

module.exports = views
