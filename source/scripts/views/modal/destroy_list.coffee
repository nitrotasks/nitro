Pref  = require '../../models/pref'
Lists = require '../../views/lists'
Modal = require '../modal'
event = require '../../utils/event'

modal = new Modal

  selector: '.modal.delete-list'

  events:
    'click .true': 'delete'
    'click .false': 'hide'

  run: ->
    if Pref.confirmDelete is Pref.CONFIRM_DELETE_ON
      modal.show()
    else
      @delete()

  delete: ->
    Lists.active.destroy()
    modal.hide()
    event.trigger 'list:all'

module.exports = modal