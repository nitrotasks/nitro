window.$ = window.jQuery = require 'jquery'
App = require './controllers/app'

$ -> new App()
