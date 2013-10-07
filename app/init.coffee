$ = require("jqueryify")
App = require './index.coffee'

$ ->
  exports.app = new App
    el: $('body')

exports = this
