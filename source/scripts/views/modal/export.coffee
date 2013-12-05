Modal = require '../modal'

modal = new Modal

  selector: '.modal.export'

  ui:
    textarea: 'textarea'

  events:
    'click .true': 'import'
    'click .false': 'hide'

  run: ->
    @ui.textarea.val 'TODO: Show all the data here'
    modal.show()

  import: ->
    console.log 'TODO: importing data...'

module.exports = modal
