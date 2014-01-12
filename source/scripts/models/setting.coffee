Base  = require 'base'
Sync  = require '../controllers/sync'
Local = require '../controllers/local'

class Setting extends Base.Model

  classname: 'pref'

  defaults:
    id: 's0'

    # Settings
    sort:               yes
    night:              'light'
    language:           'en-us'
    weekStart:          '1'
    dateFormat:         'dd/mm/yy'
    confirmDelete:      yes
    completedDuration:  'day'

# Create a new instance of Setting
settings = new Setting()

# Add localStorage support
Local.include(settings)
Sync.include(settings)

module.exports = settings
