# Spine
Spine           = require 'spine'

# Models
List            = require './list.coffee'

# Utils
UpdateAttribute = require '../lib/updateAttr.coffee'

class window.Setting extends Spine.Model
  @configure 'Setting',
    'sort',
    'weekStart',
    'dateFormat',
    'completedDuration',
    'confirmDelete',
    'noAccount',
    'night',
    'language',
    'pro',
    'notifications',
    'notifyEmail',
    'notifyTime',
    'notifyRegular',
    'uid',
    'token',
    'user_name',
    'user_email',
    'oauth'

  constructor: ->
    super

    # Set default settings
    @pro               ?= 0
    @sort              ?= yes
    @night             ?= no
    @language          ?= 'en-us'
    @weekStart         ?= "1"
    @noAccount         ?= false
    @dateFormat        ?= 'dd/mm/yy'
    @notifyTime        ?= 9
    @notifyEmail       ?= no
    @confirmDelete     ?= yes
    @notifyRegular     ?= 'upcoming'
    @notifications     ?= no
    @completedDuration ?= 'day'

    $('html').addClass 'dark' if @night == yes

  @extend @Sync
  @include @Sync
  @extend UpdateAttribute

  # Change a setting
  @set: (key, value) =>
    @first().updateAttribute key, value
    return value

  # Easy way to toggle a setting
  @toggle: (key) =>
    @set key, !@get(key)

  # Get a setting
  @get: (key) =>
    @first()[key]
  
  # Delete a setting
  @delete: (key) =>
    @set(key, null)
    return true

  # Why do we even have this?
  @sortMode: => @get('sort')

  # Check is user is pro
  @isPro: -> Setting.get('pro') is 1

module.exports = Setting
