Modal = require '../modal'

modal = new Modal

  selector: '.modal.export'

  elements:
    'textarea': 'textarea'

  events:
    'click .true': 'import'
    'click .false': 'hide'

  run: ->
    @textarea.val 'hello world'
    modal.show()

  import: ->
    console.log 'importing data...'

module.exports = modal