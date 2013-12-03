Modal = require '../modal'

# TODO: Fix all this code

modal = new Modal

  selector: '.modal.email'

  elements:
    'input': 'input'

  events:
    'click button': 'submit'
    'keyup input': 'keyup'

  keyup: (e) ->
    if e.keyCode is Keys.ENTER then @submit()

  submit: ->
    if setting.isPro()
      email = @input.val()
      return unless email.match(/.+@.+\..+/)
      # uid = require #('../../models/setting').get('uid')
      # listId = require #('../../models/list').current.id
      Sync.emit('emailList', [uid, listId, email])
    else
      $('.modal.proventor').modal('show')

    modal.hide()

  onShow: ->
    @input.focus()

  onHide: ->
    @input.val('')

module.exports = modal
