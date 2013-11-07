Base = require 'base'
Local = require '../controllers/local'

class Setting extends Base.Model

  className: 'setting'

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

# Create a new instance of Setting
settings = new Setting()

# Add localStorage support
new Local(settings)

module.exports = settings
