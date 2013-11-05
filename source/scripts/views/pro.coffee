Base = require 'base'
Setting = require '../models/setting'

PRO_CLASS = 'nitro_pro'

class Pro extends Base.View

  constructor: ->
    super
    @set()

    @listen Setting,
      'change:pro': @set

  set: (status: Setting.pro) =>
    @el.toggleClass(PRO_CLASS, status)

module.exports = Pro
