Pref = require '../../models/pref'
Modal = require '../modal'

task = null

modal = new Modal

  selector: '.delete-task.modal'

  events:
    'click .true': 'delete'
    'click .false': 'hide'

  run: (_task) ->
    task = _task
    if Pref.confirmDelete
      modal.show()
    else
      @delete()

  delete: =>
    task?.destroy()
    modal.hide()

module.exports = modal
