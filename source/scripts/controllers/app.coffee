# Load librariess
libs = require '../libs/libs'

# Base
Base = require 'base'
require '../utils/touchify'

# Utilities
Keys      = require '../utils/keys'
translate = require '../utils/translate'

# Models
Task    = require '../models/task'
List    = require '../models/list'
setting = require '../models/setting'

# Controllers
Tasks         = require '../controllers/tasks'
Lists         = require '../controllers/lists'
ListTitle     = require '../controllers/lists.title'
Panel         = require '../controllers/panel'
Settings      = require '../controllers/Settings'
Auth          = require '../controllers/auth'
Modal         = require '../controllers/modal'
LoadingScreen = require '../controllers/loadingScreen'
Sync          = require '../controllers/sync'

class App extends Base.Controller

  elements:
    '.tasks': 'tasksContainer'
    '.sidebar': 'listsContainer'
    '.tasks .title': 'listTitle'
    'header': 'panel'
    '.settings': 'Settings'
    '.auth': 'auth'
    '.tour': 'tour'
    '.tour .image': 'tourImage'
    '.loading-screen': 'loadingScreen'

  events:
    'keyup': 'handleShortcut'

  constructor: ->
    super

    # Load Settings
    setting.trigger 'fetch'

    # Init Settings
    Settings = new Settings
      el: @Settings

    # Load translations
    translate.init()

    # Init Auth
    @auth = new Auth( el: @auth )

    # Init panel
    @panel = new Panel( el: @panel )

    # Init tasks
    @tasks = new Tasks( el: @tasksContainer )

    # Init lists
    @lists = new Lists( el: @listsContainer )
    new ListTitle( el: @listTitle )

    # Transform loadingScreen into something we can hide and show
    @loadingScreen = new LoadingScreen( el: @loadingScreen )

    # Init Modals
    Modal.init()

    Task.trigger 'fetch'
    List.trigger 'fetch'

    # Create inbox list
    if not List.exists('inbox')
      List.create
        id: 'inbox'
        name: 'Inbox'
        permanent: yes

    List.get('inbox').name = translate('Inbox')

    # Doesn't run in the Settings constructor. Bit of a pain
    if setting.completedDuration is 'day'
      Settings.moveCompleted()

    # Select the first list on load
    @lists.showInbox()

    # Login to sync
    uid = setting.uid
    token = setting.token

    # Handle offline mode
    if setting.noAccount then setting.trigger('offline')

    setPro = -> $('html').toggleClass('proenable', setting.isPro())
    setting.on 'change:pro', setPro
    setPro()

    if uid? and token?
      @auth.el.hide()
      Sync.connect uid, token, =>
        @loadingScreen.hide()
        setting.trigger 'login'
    else
      @loadingScreen.hide()

    setting.on 'haveToken', (data) ->
      Sync.connect data[0], data[1], ->
        setting.trigger 'login'


  handleShortcut: (e) =>
    Keys.handleKey(e.which)

module.exports = App

