Base = require 'base'
Sync = require '../controllers/sync'

class Setting extends Base.Model

  defaults:

    # User
    pro:                no
    loggedin:           no
    uid:                null
    token:              null
    userName:           null
    userEmail:          null

    # Misc
    sort:               yes

    # Settings
    night:              no
    language:           'en-us'
    weekStart:          '1'
    dateFormat:         'dd/mm/yy'
    confirmDelete:      yes
    completedDuration:  'day'

    # Notifications
    notifyTime:         9
    notifyEmail:        no
    notifyRegular:      'upcoming'
    notifications:      no

  constructor: ->
    super

  # @extends  Sync.core
  # @includes Sync

module.exports = new Setting()
