Tab = require '../settings_tab'
User = require '../../models/user'

account = new Tab

  id: 'account'

  selector: '.account'

  ui:
    name:      '.name input'
    email:     '.email input'
    password:  '.password input'

  events:
    'click           button.edit': 'editField'
    'blur .name input': 'saveName'
    'blur .email input': 'saveEmail'
    'blur .password input': 'savePassword'

  methods: ['saveName', 'saveEmail', 'savePassword']

  load: ->
    @ui.name.val User.name
    @ui.email.val User.email

    if User.authenticated
      @el.addClass 'logged-in'

  editField: (event) ->
    control = $(this).parent()
    control.addClass 'edit'
    control.find('input')
      .prop('disabled', false)
      .focus()

  saveName: (e) ->
    @ui.name.prop 'disabled', true
    User.name = @ui.name.val()
    account.saveField(e)

  saveEmail: (e) ->
    @ui.email.prop 'disabled', true
    User.email = @ui.email.val()
    account.saveField(e)

  savePassword: (e) ->
    @ui.password.prop 'disabled', true
    account.saveField(e)

  saveField: (event) ->
    $(event.target).parent().removeClass('edit')

module.exports = account
