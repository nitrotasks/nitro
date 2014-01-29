Base  = require 'base'
Sync  = require '../controllers/sync'
Local = require '../controllers/local'
Handler = require '../controllers/sync/pref'

class Pref extends Base.Model

  classname: 'pref'

  defaults:

    # Default id
    id: 0

    # Settings
    sort:               yes
    night:              'light'
    language:           'en-us'
    weekStart:          '1'
    dateFormat:         'dd/mm/yy'
    confirmDelete:      yes
    completedDuration:  'day'

# Create a new instance of Setting
prefs = new Pref()

# Add localStorage support
Local.include(prefs)

# Add sync support
Sync.include(prefs, Handler)

module.exports = prefs
