import authenticationStore from '../source/js/stores/auth.js'

describe('authentication', function() {
  before(function(done) {
    console.log('Creating test account...')
    const complete = function() {
      console.log('Created test account.')
    }
    const createAccount = function() {
      authenticationStore.createAccount('testuser', 'testpassword')
        .then(done)
        .then(complete)
        .catch(done)
    }
    const deleteAccount = function() {
      authenticationStore.deleteAccount().then(createAccount)
    }
    // deletes the account and then makes a new one
    authenticationStore.authenticate('testuser', 'testpassword').then(deleteAccount).catch(createAccount)
  })
  it('should be able to sign in', function(done) {
    authenticationStore.authenticate('testuser', 'testpassword')
      .then(function() {
        done()
      })
      .catch(done)
  })
  it('should reject incorrect logins', function(done) {
    authenticationStore.authenticate('wrong', 'incorrect')
      .then(function(data) {
        done(new Error(data))
      }).catch(function(err) {
        done()
      })
  })
})