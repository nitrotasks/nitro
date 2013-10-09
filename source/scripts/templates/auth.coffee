
module.exports = (message) ->
  switch message
    when 'err_bad_pass'
      "Incorrect email or password. <a href=\"http://#{CONFIG.server}/forgot\">Forgot?</a>"
    when 'err_old_email'
      @errorNote.text 'Account already in use'
    else
      message
