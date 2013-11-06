Setting = require '../../models/setting'
Modal = require '../modal'

task = null

destroyTaskModal = new Modal

  selector: '.delete-task.modal'

  events:
    'click .true': 'delete'
    'click .false': 'hide'

  run: (_task) ->
    task = _task
    if Setting.confirmDelete
      destroyTaskModal.show()
    else
      @delete()

  delete: =>
    task?.destroy()
    destroyTaskModal.hide()

module.exports = destroyTaskModal
