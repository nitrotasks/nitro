config = require '../utils/config'

module.exports = (message) ->
  switch message
    when 'err_bad_pass'
      "Incorrect email or password. <a href=\"http://#{ config.server }/forgot\">Want to reset?</a>"
    when 'err_old_email'
      'Sorry, but that email address has already been used'
    else
      message
