Modal = require '../modal'

# TODO: Fix all this code

modal = new Modal

  selector: '.modal.email'

  ui:
    input: 'input'

  events:
    'click button': 'submit'
    'keyup input': 'keyup'

  keyup: (e) ->
    if e.keyCode is Keys.ENTER then @submit()

  submit: ->
    if setting.isPro()
      email = @ui.input.val()
      return unless email.match(/.+@.+\..+/)
      Sync.emit('emailList', [uid, listId, email])
    else
      $('.modal.proventor').modal('show')

    modal.hide()

  onShow: ->
    @ui.input.focus()

  onHide: ->
    @ui.input.val ''

module.exports = modal
