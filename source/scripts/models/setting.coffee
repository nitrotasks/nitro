Base = require 'base'
Sync = require '../controllers/sync'

class Setting extends Base.Model

  defaults:
    pro:                0
    sort:               yes
    night:              no
    language:           'en-us'
    weekStart:          '1'
    noAccount:          false
    dateFormat:         'dd/mm/yy'
    notifyTime:         9
    notifyEmail:        no
    confirmDelete:      yes
    notifyRegular:      'upcoming'
    notifications:      no
    completedDuration:  'day'
    uid:                null
    token:              null
    userName:           null
    userEmail:          null
    oauth:              null

  constructor: ->
    super

    # TODO: Move to main file
    $('html').addClass 'dark' if @night == yes

  # @extends  Sync.core
  # @includes Sync

  # Check is user is pro
  isPro: -> return @pro isnt 0

module.exports = new Setting()
window.SETTING = module.exports
