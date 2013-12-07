Modal = require '../modal'
dataHandler = require '../../controllers/data'

modal = new Modal

  selector: '.modal.export'

  ui:
    textarea: 'textarea'

  events:
    'click .true': 'import'
    'click .false': 'hide'

  run: ->
    modal.ui.textarea.val dataHandler.export()
    modal.show()

  import: ->
    dataHandler.import modal.ui.textarea.val()
    modal.hide()
    document.location.reload()

module.exports = modal
