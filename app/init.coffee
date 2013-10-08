$   = require 'jqueryify'
App = require './controllers/app.coffee'

$ ->
  new App
    el: $('body')

