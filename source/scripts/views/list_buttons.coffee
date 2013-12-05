# TODO: Rename this file

Base = require 'base'
List = require '../models/list'
ListModal = require '../views/modal/destroy_list'
ShareModal = require '../views/modal/share'
EmailModal = require '../views/modal/email'

class ListButtons extends Base.View

  el: '.list-buttons'

  ui:
    deleteBtn: '.trash'
    sortBtn: '.sort'

  events: Base.touchify
    'click .trash': 'trash'
    'click .email': 'email'
    'click .print': 'print'
    'click .share': 'share'
    'click .sort':  'sort'

  constructor: ->
    super

    @listen List,
      'select:model': @update

  # Show/Hide buttons depending on the list attributes
  update: (list) =>

    if list.permanent
      @ui.deleteBtn.fadeOut(150)
    else
      @ui.deleteBtn.fadeIn(150)

    if list.disabled
      @ui.sortBtn.fadeOut(150)
    else
      @ui.sortBtn.fadeIn(150)

  trash: ->
    ListModal.run()

  email: ->
    EmailModal.run()

  print: ->
    window.print()

  share: ->
    ShareModal.run()

  sort: ->
    Setting.toggle('sort')

module.exports = ListButtons
