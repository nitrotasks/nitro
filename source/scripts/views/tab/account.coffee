Tab = require '../settings_tab'
User = require '../../models/user'

account = new Tab

  id: 'account'

  selector: '.account'

  ui:
    name:  'span.name'
    email: 'span.email'

  methods: ['updateDetails']
  events: {}

  load: ->

    @listen User,
      'login':        @updateDetails
      'change:name':  @updateDetails
      'change:email': @updateDetails

  updateDetails: ->

    return unless User.authenticated

    @ui.name.text User.name
    @ui.email.text User.email

    if User.authenticated
      @el.addClass 'logged-in'

module.exports = account
