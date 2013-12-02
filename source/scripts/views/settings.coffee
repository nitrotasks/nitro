Base   = require 'base'
Modal   = require '../views/modal/settings'

# Load tabs
Tab     = require '../views/settings_tab'
General  = require '../views/tab/general'
Account  = require '../views/tab/account'
Language = require '../views/tab/language'
About    = require '../views/tab/about'

class Settings extends Base.View

  events: {}

  constructor: ->
    super

    # TODO: This is just a placeholder
    $('#open-settings-button').click =>
      Modal.show()

    # Bind to the settings modal
    @bind $ '.modal.settings'

module.exports = Settings

###

class Settings extends Base.View

  elements:
    '.disabler'           : 'disabler'
    '.language'           : 'language'
    '.username'           : 'username'
    '.clear-data'         : 'clearDataButton'
    '.week-start'         : 'weekStart'
    '.date-format'        : 'dateFormat'
    '.night-mode'         : 'nightMode'
    '#notify-time'        : 'notifyTime'
    '#notify-email'       : 'notifyEmail'
    '#notify-toggle'      : 'notifyToggle'
    '#notify-regular'     : 'notifyRegular'
    '.confirm-delete'     : 'confirmDelete'
    '.completed-duration' : 'completedDuration'
    '.clear-data-label'   : 'clearDataLabel'
    '#passwordreset'      : 'passwordreset'
    '.user-name'          : 'nameInput'
    '.user-email'         : 'emailInput'

  events:
    'click .login'         : 'login'
    'change input'         : 'save'
    'change select'        : 'save'
    'click .tabs li'       : 'tabSwitch'
    'click .clear-data'    : 'clearData'
    'click .night-mode'    : 'toggleNight'
    'click .language a'    : 'changeLanguage'
    'click .export-data'   : 'exportData'
    'click button.probtn'  : 'proUpgrade'
    'click #notify-toggle' : 'toggleNotify'
    'click .edit'          : 'editField'
    'click .save'          : 'saveField'

  constructor: ->
    super

    # TODO: This is just a placeholder
    $('#open-settings-button').click =>
      @show()

    # Bind to the settings modal
    @bind $ '.modal.settings'

    # @listen Event,
    #   'settings:show': @show
    #   'login': @account

    @loadSettings()
    @setLanguage()

    # unless setting.notifications and setting.isPro()
    # @disableNotifications()
    # @setupNotifications()

  # Fill in the form values
  loadSettings: =>
    @dateFormat.val         setting.dateFormat
    @completedDuration.val  setting.completedDuration
    @notifyTime.val         setting.notifyTime
    @notifyRegular.val      setting.notifyRegular
    @confirmDelete.prop     'checked', setting.confirmDelete
    @nightMode.prop         'checked', setting.night
    @notifyEmail.prop       'checked', setting.notifyEmail

  # Highlight the current language
  setLanguage: (language = setting.language) =>
    $("[data-value=#{ language }]").addClass('selected')

  # Disable notifications
  disableNotifications: =>
    @disabler.prop('disabled', true).addClass('disabled')
    @notifyToggle.prop 'checked', false

  # TODO: What does this do?
  # Happens when you login
  account: =>

    # Show the proper account thing
    $('.account .signedout').hide()
    $('.account .signedin').show()

    @passwordreset.attr('action', 'http://' + config.server + '/forgot')
    @nameInput.val(setting.userName)
    @emailInput.val(setting.userEmail)

    # Forgive Me. No.
    $('.account .user-language')
      .val $('.language [data-value=' + setting.language + ']').text()

    @clearDataLabel.hide()
    @clearDataButton.text $.i18n._('Logout')

    $('.clearWrapper').css('text-align', 'center')

  proUpgrade: =>
    location.href = 'http://nitrotasks.com/pro?uid=' + setting.uid

  show: =>
    Modal.show()

  save: =>
    setting.username = @username.val()
    setting.weekStart = @weekStart.val()
    setting.dateFormat = @dateFormat.val()
    setting.completedDuration = @completedDuration.val()
    setting.confirmDelete =  @confirmDelete.prop 'checked'
    setting.night =  @nightMode.prop 'checked'
    setting.notifications =  @notifyToggle.prop 'checked'
    setting.notifyEmail =  @notifyEmail.prop 'checked'
    setting.notifyTime =  @notifyTime.val()
    setting.notifyRegular =  @notifyRegular.val()

    # Clear Notify Timeout
    try
      clearTimeout(settings.notifyTimeout)

    @setupNotifications()

  moveCompleted: =>
    List.forEach (list) ->
      list.moveCompleted()

  tabSwitch: (event) =>
    if $(e.target).hasClass('close')
      @el.modal('hide')
    else
      @currentTab?.removeClass 'current'
      @currentTab = $ event.target
      @currentTab.addClass 'current'
      @getTab(@currentTab.data('id')).addClass('current')
      @el
        .find 'div.' + $(e.target).addClass('current').attr('data-id')
        .addClass 'current'

  toggleNight: (e) =>
    if setting.isPro()
      $('html').toggleClass 'dark'
    else
      @nightMode.prop('checked', false)
      @el.modal('hide')
      $('.modal.proventor').modal('show')
      setting.night = false

  #FFFFUCKIT.
  editField: (e) ->
    if $(e.target).hasClass('name') or $(e.target).hasClass('email')
      text = $(e.target).text()
      @nameInput.prop('disabled', true)
      @emailInput.prop('disabled', true)
      $(e.target).parent().find('.save').hide()
      $(e.target).parent().find('.edit').text($.i18n._('Edit'))

      $(e.target).text(text)

      if $(e.target).text() is $.i18n._('Edit')
        $(e.target).text($.i18n._('Cancel'))

        if $(e.target).hasClass('name')
          $(e.target).parent().find('.name.save').show()
          @nameInput.prop('disabled', false).focus()
        else if $(e.target).hasClass('email')
          $(e.target).parent().find('.email.save').show()
          @emailInput.prop('disabled', false).focus()
      else
        $(e.target).parent().find('button.save').hide()
        $(e.target).text($.i18n._('Edit'))
        @nameInput.val(setting.user_name)
        @emailInput.val(setting.user_email)

    else if $(e.target).hasClass('language')
      $('.tabs li[data-id=language]').trigger('click')

  saveField: (e) ->
    # Hides Button
    $(e.target).hide()

    setting.userName = @nameInput.val()
    setting.userEmail = @emailInput.val()
    @nameInput.prop('disabled', true)
    @emailInput.prop('disabled', true)
    $(e.target).parent().find('button.edit').text($.i18n._('Edit'))

  setupNotifications: =>
    if setting.notifications and setting.isPro()

      now = Date.now()
      notifyTime = new Date()
      hour = setting.notifyTime

      notifyTime.setHours(hour)
      notifyTime.setMinutes(8)
      notifyTime.setSeconds(0)
      notifyTime.setMilliseconds(0)
      notifyTime = notifyTime.getTime()

      # If the time has passed, increment a day
      if notifyTime - now < 0
        notifyTime += 86400000

      @log "Notifying in: #{ ( notifyTime - now ) / 1000 } seconds"

      # console.log Task.all

      @notifyTimeout = setTimeout =>
        dueNumber = 0
        upcomingNumber = 0

        for task in Task.all()
          if task.date isnt '' and task.date isnt false and !task.completed
            # Number of Tasks that have due dates
            upcomingNumber++
            # Number of Tasks that are due
            if new Date(task.date) - new Date() < 0
              dueNumber++

        console.log {due: dueNumber, upcoming: upcomingNumber}

        if setting.notifyRegular is 'upcoming'
          notification = window.webkitNotifications.createNotification(
            'img/icon.png',
            'Nitro Tasks',
            'You have ' + upcomingNumber + ' tasks upcoming'
          ).show()
        else
          notification = window.webkitNotifications.createNotification(
            'img/icon.png',
            'Nitro Tasks',
            'You have ' + dueNumber + ' tasks due'
          ).show()
        @setupNotifications()
      , notifyTime - now

  logout: (e) ->
    Cookies.removeItem('uid')
    Cookies.removeItem('token')
    document.location.reload()

  clearData: =>
    if setting.token
      localStorage.clear()
      @logout()
    else
      $('.modal.settings').modal 'hide'
      $('.modal.delete').modal 'show'
      $('.modal.delete .true').on('click touchend', =>
        localStorage.clear()
        @logout()
        $('.modal.delete').modal 'hide'
        $('.modal.delete .true').off 'click touchend'
      )

      $('.modal.delete .false').on('click touchend', (e) ->
        $('.modal.delete').modal 'hide'
        $('.modal.delete .false').off 'click touchend'
      )

  exportData: ->
    @el.modal('hide')
    $('.modal.export').modal('show')
    $('.modal.export textarea').val Spine.Sync.exportData()

    $('.modal.export button').click ->
      if $(this).hasClass('true')
        Spine.Sync.importData($('.modal.export textarea').val())
      $('.modal.export').modal('hide')
      $(this).off('click')

  changeLanguage: (e) =>
    # Pirate Speak is a Pro feature
    if $(e.target).attr('data-value') is 'en-pi' and !setting.isPro()
      @el.modal('hide')
      $('.modal.proventor').modal('show')
    else
      setting.language = $(e.target).attr('data-value')
      window.location.reload()

  login: =>
    $('.auth').fadeIn(300)
    @el.modal('hide')

  toggleNotify: =>
    if @notifyToggle.prop('checked')
      if setting.isPro()
        # Enable Checkboxes
        window.webkitNotifications.requestPermission ->
          console.log('Hello')
          if window.webkitNotifications.checkPermission() is 0
            console.log('Hello')
            $('.disabler').prop('disabled', false).removeClass('disabled')

          else
            setting.notifications = false
            alert 'You\'ll need to open your browser settings and ' +
              'allow notifications for app.nitrotasks.com'

      else
        @notifyToggle.prop('checked', false)
        # Because it gets set as true for a stupid reason
        setting.notifications = false
        @el.modal('hide')
        $('.modal.proventor').modal('show')
    else
      # Disable Checkboxes
      @disabler.prop('disabled', true).addClass('disabled')

module.exports = Settings

###