require './lib/setup.coffee'
Base = require 'base'

# Helpers
Keys = require './utils/keys.coffee'

# Models
Task    = require './models/task.coffee'
List    = require './models/list.coffee'
setting = require './models/setting.coffee'

# Controllers
Tasks         = require './controllers/tasks.coffee'
Lists         = require './controllers/lists.coffee'
ListTitle     = require './controllers/lists.title.coffee'
Panel         = require './controllers/panel.coffee'
Settings      = require './controllers/Settings.coffee'
Auth          = require './controllers/auth.coffee'
Modal         = require './controllers/modal.coffee'
LoadingScreen = require './controllers/loadingScreen.coffee'
Sync          = require './controllers/sync.coffee'

class App extends Base.Controller

  elements:
    '.tasks': 'tasksContainer'
    '.sidebar': 'listsContainer'
    '.tasks .title': 'listTitle'
    'header': 'panel'
    '.Settings': 'Settings'
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
    Settings = new Settings( el: @Settings )

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

    # Load translations
    language = setting.language
    $.getJSON "i18n/#{ language }.json", (dict) =>
      $.i18n.setDictionary(dict)

      # Date picker translation
      if language[0..1] isnt 'en'
        $.getScript("i18n/datepicker/#{ language }.js")

      # Puts the translations in
      $('[data-tPlaceholder]').map ->
        $(this).attr 'placeholder', $.i18n._($(this).attr('data-tPlaceholder'))

      $('[data-tText]').map ->
        $(this)._t $(this).attr 'data-tText'

      $('[data-tTitle]').map ->
        $(this).attr 'title', $.i18n._($(this).attr('data-tTitle'))

      # Load data for localStorage
      Task.trigger 'fetch'
      List.trigger 'fetch'

      # Create inbox list
      if not List.exists('inbox')
        List.create
          id: 'inbox'
          name: 'Inbox'
          permanent: yes

      List.get('inbox').name = $.i18n._('Inbox')

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

