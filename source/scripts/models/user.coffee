Base = require 'base'
Local = require '../controllers/local'

class User extends Base.Model

  classname: 'user'

  defaults:

    # Status
    authenticated: no
    offline: no

    # Details
    uid: null
    pro: no
    token: null
    name: null
    email: null

  loggedIn: =>
    @offline or @authenticated

# Create a new instance of user
user = new User()

# Add localStorage support
Local.include(user)

module.exports = user
