Modal = require '../modal'

destroyTaskModal = new Modal

  el: $ '.modal.delete-task'

  events:
    'click .true': 'delete'
    'click .false': 'hide'

  run: (@task) ->
    if setting.confirmDelete
      @show()
    else
      @delete()

  delete: ->
    @task?.destroy()
    @hide()

module.exports = destroyTaskModal
