require 'lib/setup'
Spine = require 'spine'

# Helpers
Keys = require 'utils/keys'

# Models
Task    = require 'models/task'
List    = require 'models/list'
Setting = require 'models/setting'

# Controllers
Tasks         = require 'controllers/tasks'
Lists         = require 'controllers/lists'
ListTitle     = require 'controllers/lists.title'
Panel         = require 'controllers/panel'
Settings      = require 'controllers/settings'
Auth          = require 'controllers/auth'
Modal         = require 'controllers/modal'
LoadingScreen = require 'controllers/loadingScreen'

class App extends Spine.Controller

  elements:
    '.tasks': 'tasksContainer'
    '.sidebar': 'listsContainer'
    '.tasks .title': 'listTitle'
    'header': 'panel'
    '.settings': 'settings'
    '.auth': 'auth'
    '.tour': 'tour'
    '.tour .image': 'tourImage'
    '.loading-screen': 'loadingScreen'

  events:
    'keyup': 'handleShortcut'

  constructor: ->
    super

    # Load settings
    Setting.fetch()
    if Setting.count() is 0 then Setting.create()

    # Init settings
    window.settings = new Settings( el: @settings )

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
    language = Setting.get('language')
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
      Task.fetch()
      List.fetch()

      # Create inbox list
      if List.exists('inbox') is false
        List.create
          id: 'inbox'
          name: 'Inbox'
          permanent: yes

      List.find('inbox').updateAttribute('name', $.i18n._('Inbox'))

      # Doesn't run in the settings constructor. Bit of a pain
      if Setting.get('completedDuration') is 'day'
        settings.moveCompleted()

      # Select the first list on load
      @lists.showInbox()

    # Login to sync
    uid = Setting.get('uid')
    token = Setting.get('token')

    # Handle offline mode
    if Setting.get('noAccount') then Setting.trigger('offline')

    setPro = -> $('html').toggleClass('proenable', Setting.isPro())
    Setting.on 'update:pro', setPro
    setPro()

    if uid? and token?
      @auth.el.hide()
      Spine.Sync.connect uid, token, =>
        @loadingScreen.hide()
        Setting.trigger 'login'
    else
      @loadingScreen.hide()

    Setting.bind 'haveToken', (data) ->
      Spine.Sync.connect data[0], data[1], ->
        Setting.trigger 'login'


  handleShortcut: (e) =>
    Keys.handleKey(e.which)

module.exports = App

