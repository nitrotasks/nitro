# TODO: Rename this file

Base = require 'base'
List = require '../models/list'
ListModal = require '../views/modal/destroy_list'
ShareModal = require '../views/modal/share'
EmailModal = require '../views/modal/email'

class ListButtons extends Base.View

  elements:
    '.trash': 'deleteBtn'
    '.sort':  'sortBtn'

  events:
    'click .trash': 'trash'
    'click .email': 'email'
    'click .print': 'print'
    'click .share': 'share'
    'click .sort':  'sort'

  constructor: ->
    Base.touchify @events
    super

    @el = $('.list-buttons')
    @bind()

    @listen List,
      'select:model': @update

  # Show/Hide buttons depending on the list attributes
  update: (list) =>

    if list.permanent
      @deleteBtn.fadeOut(150)
    else
      @deleteBtn.fadeIn(150)

    if list.disabled
      @sortBtn.fadeOut(150)
    else
      @sortBtn.fadeIn(150)

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