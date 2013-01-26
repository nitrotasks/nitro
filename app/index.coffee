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

Cookies = require "utils/cookies"

class App extends Spine.Controller

  elements:
    '.tasks': 'tasksContainer'
    '.sidebar': 'listsContainer'
    '.tasks .title': 'listTitle'
    'header': 'panel'
    '.settings': 'settings'
    '.auth': 'auth'
    ".tour": 'tour'
    ".tour .image": 'tourImage'

  events:
    "keyup": "handleShortcut"
    "click .tour .close": "closeTour"
    "click .tour .learn": "nextTourSlide"

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

      # Doesn't run in the settings constructor. Bit of a pain
      if Setting.get("completedDuration") is "day"
        settings.moveCompleted()

      # Select the first list on load
      @lists.showInbox()

    # Login to sync
    uid = Setting.get("uid")
    token = Setting.get("token")

    if uid? and token?
      Spine.Sync.connect uid, token, ->
        Setting.trigger "login"

    Setting.bind "haveToken", (data) ->
      Spine.Sync.connect data[0], data[1], ->
        Setting.trigger "login"

  nextTourSlide: =>
    pos = @tourImage.css "background-position-x"
    if pos is "0%"
      @tourImage.css "background-position-x", "-650px"

      # Makes sure that the animation isn't in progress
    else if pos.substring(pos.length-2, pos.length) is "px" and (parseInt(pos.substring(0, pos.length-2)) - 650) % 650 is 0
      @tourImage.css "background-position-x", (parseInt(pos.substring(0, pos.length-2)) - 650) + "px"

  closeTour: =>
    @tour.modal("hide")

  handleShortcut: (e) =>
    focusedInputs = $ ":focus"

    # Collapses or Blurs
    if e.which is Keys.ESCAPE
      if focusedInputs.length is 0
        @tasks.collapseAll()
      else
        focusedInputs.blur()
    else
      # Handles keyboard shortcuts
      if focusedInputs.length is 0

        # New Task
        if e.which is 78
          $(".new-task").focus().val("")

        # New List
        else if e.which is 76
          $(".new-list").focus().val("")

        # Search
        else if e.which is 70
          $(".search input").focus().val("")

        # Print
        else if e.which is 80
          $(".buttons .print").trigger("click")

        # Settings
        else if e.which is 188
          $(".user").trigger("click")

        # Go to the prev list
        else if e.which is 75
          if $(".sidebar .current").prev().length is 0
            # Go to completed
            $(".sidebar .completed").trigger("click")
          else
            $(".sidebar .current").prev().trigger("click")
            # Cancel the Focus if shortcut is used
            $(".new-task").blur()

        # Go to the next list
        else if e.which is 74
          if $(".sidebar .current").next().hasClass("lists")
            # Go to first list
            $($(".sidebar .lists").children()[0]).trigger("click")
            $(".new-task").blur()
          else
            $(".sidebar .current").next().trigger("click")
            $(".new-task").blur()


module.exports = App

