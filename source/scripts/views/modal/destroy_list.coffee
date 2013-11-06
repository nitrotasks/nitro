List = require '../../models/list'
Modal = require '../modal'

modal = new Modal

  selector: '.modal.delete-list'

  events:
    'click .true': 'delete'
    'click .false': 'hide'

  run: ->
    if setting.confirmDelete
      modal.show()
    else
      @delete()

  delete: ->
    List.current.trigger 'kill'
    modal.hide()

module.exports = modal