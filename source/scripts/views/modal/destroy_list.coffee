Pref  = require '../../models/pref'
Lists = require '../../views/lists'
Modal = require '../modal'

modal = new Modal

  selector: '.modal.delete-list'

  events:
    'click .true': 'delete'
    'click .false': 'hide'

  run: ->
    if Pref.confirmDelete
      modal.show()
    else
      @delete()

  delete: ->
    Lists.active.destroy()
    modal.hide()

module.exports = modal