# TODO: Rename this file

Base = require 'base'
List = require '../models/list'
ListModal = require '../views/modal/destroy_list'
Setting = require '../models/setting'

# ShareModal = require '../views/modal/share'
# EmailModal = require '../views/modal/email'

class ListMenu extends Base.View

  el: '.list-menu'

  ui:
    delete: '.delete'

  events: Base.touchify
    'click .delete': 'delete'
    'click .print': 'print'
    'click .sort': 'sort'

  constructor: ->
    super

    @listen List,
      'select:model': @update

  # Show/Hide buttons depending on the list attributes
  update: (list) =>
    @ui.delete.toggleClass 'hidden', list.permanent

  delete: ->
    console.log 'deleting list'
    ListModal.run()

  # email: ->
  #   EmailModal.run()

  print: ->
    window.print()

  # share: ->
  #   ShareModal.run()

  sort: ->
    Setting.sort = !Setting.sort

module.exports = ListMenu
