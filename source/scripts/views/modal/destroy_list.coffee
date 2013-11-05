Modal = require '../modal'

destroyListModal = new Modal

  el: $ '.modal.delete-list'

  events:
    'click .true': 'delete'
    'click .false': 'hide'

  run: ->
    if setting.confirmDelete
      @show()
    else
      @delete()

  delete: ->
    List.current.trigger 'kill'
    @hide()

module.exports = destroyListModal