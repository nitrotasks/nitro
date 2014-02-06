Pref = require '../../models/pref'
Modal = require '../modal'

tasks = null

modal = new Modal

  selector: '.delete-task.modal'

  events:
    'click .true': 'delete'
    'click .false': 'hide'

  run: (_tasks) ->
    tasks = _tasks
    if Pref.confirmDelete is Pref.CONFIRM_DELETE_ON
      modal.show()
    else
      @delete()

  delete: =>
    if tasks?
      task.destroy() for task in tasks
    modal.hide()

module.exports = modal
