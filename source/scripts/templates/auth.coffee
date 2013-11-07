config = require '../utils/config'

module.exports = (status, message) ->
  switch status

    when 404
      return 'Could not connect to server.'

  switch message

    when 'err_bad_pass'
      return "Incorrect email or password. <a href=\"http://#{
        config.server
      }/forgot\">Want to reset?</a>"

    when 'err_old_email'
      return 'Sorry, but that email address has already been used'

  return message
