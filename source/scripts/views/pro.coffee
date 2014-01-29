Base = require 'base'
Pref = require '../models/pref'

PRO_CLASS = 'nitro_pro'

class Pro extends Base.View

  constructor: ->
    super
    @set()

    @listen Pref,
      'change:pro': @set

  set: (status: Pref.pro) =>
    @el.toggleClass(PRO_CLASS, status)

module.exports = Pro
