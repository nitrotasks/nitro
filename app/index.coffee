require "lib/setup"
Spine = require "spine"

# Helpers
Keys = require "utils/keys"

# Models
Task    = require "models/task"
List    = require "models/list"
Setting = require "models/setting"

# Controllers
Tasks     = require "controllers/tasks"
Lists     = require "controllers/lists"
ListTitle = require "controllers/lists.title"
Panel     = require "controllers/panel"
Settings  = require "controllers/settings"
Auth      = require "controllers/auth"

class App extends Spine.Controller

  elements:
    '.tasks': 'tasksContainer'
    '.sidebar': 'listsContainer'
    '.tasks .title': 'listTitle'
    'header': 'panel'
    '.settings': 'settings'
    '.auth': 'auth'

  events:
    "keydown": "collapseAllOnEsc"

  constructor: ->
    super

    # Load settings
    Setting.fetch()
    if Setting.count() is 0
      Setting.create()

    # Init settings
    window.settings = new Settings
      el: @settings

    # Init Auth
    new Auth
      el: @auth

    # Init panel
    new Panel
      el: @panel

    # Init tasks
    @tasks = new Tasks( el: @tasksContainer )

    # Init lists
    @lists = new Lists( el: @listsContainer )
    new ListTitle
      el: @listTitle

    # Load translations
    $.getJSON 'i18n/' + Setting.get("language") + '.json', (dict) =>
      $.i18n.setDictionary(dict)

      # Date picker translation
      $.getScript('i18n/datepicker/' + Setting.get("language") + '.js') unless Setting.get("language").substring(0,2) is "en"

      # Puts the translations in
      $("[data-tPlaceholder]").map ->
        $(this).attr "placeholder", $.i18n._($(this).attr("data-tPlaceholder"))

      $("[data-tText]").map ->
        $(this)._t $(this).attr "data-tText"

      $("[data-tTitle]").map ->
        $(this).attr "title", $.i18n._($(this).attr("data-tTitle"))

      # Load data for localStorage
      Task.fetch()
      List.fetch()

      # Create inbox list
      if not !!List.exists("inbox")
        List.create
          id: "inbox"
          name: "Inbox"
          permanent: yes

      List.find("inbox").updateAttribute("name", $.i18n._("Inbox"))

      # Select the first list on load
      @lists.showInbox()

    # Login to sync
    Spine.Sync.login(Setting.first().username)

  collapseAllOnEsc: (e) =>
    if e.which is Keys.ESCAPE
      focusedInputs = $ "div:focus"
      if focusedInputs.length is 0
        @tasks.collapseAll()

module.exports = App

