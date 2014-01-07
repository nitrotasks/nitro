Base  = require 'base'
Sync  = require '../controllers/sync'
Local = require '../controllers/local'

class Setting extends Base.Model

  className: 'pref'

  defaults:

    # Settings
    sort:               yes
    night:              'light'
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

# Create a new instance of Setting
settings = new Setting()

# Add localStorage support
Local.include(settings)
Sync.include(settings)

module.exports = settings
