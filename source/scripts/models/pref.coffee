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
    sort:          1 # 0: no, 1: yes
    night:         0 # 0: light, 1: dark, 2:auto
    language:      'en-us'
    weekStart:     1 # 0: sunday, 1: monday, ...
    dateFormat:    'dd/mm/yy'
    confirmDelete: 1 # 0: no, 1: yes
    moveCompleted: 1 # 0: instantly, 1: on app launch, 2: never

# Create a new instance of Setting
prefs = new Pref()

# Add localStorage support
Local.include(prefs)

# Add sync support
Sync.include(prefs, Handler)

module.exports = prefs
