Spine = require("spine")
List  = require("models/list")
Task  = require("models/task")
ListItem = require("controllers/lists.item")
$ = Spine.$

class Lists extends Spine.Controller
  ENTER_KEY = 13

  elements:
    "ul": "lists"
    "input": "input"
    ".all": "all"
    ".all .count": "allCount"

  events:
    "keyup input": "new"
    "click li": "clickList"
    "click .all": "showAllTasks"

  constructor: ->
    super
    List.bind "create", @addOne
    List.bind "refresh", @addAll
    List.bind "changeList", @change
    Task.bind "refresh create update destroy", @updateAll

  new: (e) ->
    val = @input.val()
    if e.which is ENTER_KEY and val
      list = List.create name: val
      List.trigger "changeList", list
      @input.val ""

  addOne: (list) =>
    listItem = new ListItem( list: list )
    @lists.append listItem.render().el

  addAll: =>
    @lists.empty()
    List.each(@addOne)

  change: (list) =>
    @el.find(".active").removeClass "active"
    List.current = list

  clickList: (e) =>
    list = $(e.currentTarget).data("item")
    List.trigger "changeList", list
    true

  # Show all tasks
  showAllTasks: =>
    List.trigger "changeList",
      name: "All Tasks"
      id: "all"
      disabled: yes
    @all.addClass "active"
    true

  updateAll: =>
    @allCount.text Task.active().length

module.exports = Lists
