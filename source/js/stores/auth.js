import config from '../../../config.js'
import Events from '../models/events.js'
import { checkStatus } from '../helpers/fetch.js'

class AuthenticationStore extends Events {
  constructor(props) {
    super(props)
    this.refreshToken = localStorage.getItem('nitro3-auth') || '{}'
    this.refreshToken = JSON.parse(this.refreshToken)
    this.accessToken = null

    this.getToken()
  }
  isSignedIn() {
    return Object.keys(this.refreshToken).length > 0
  }
  formSignIn(username, password) {
    if (username === 'local@nitrotasks.com') {
      this.refreshToken = {local: true}
      this.trigger('sign-in-status')
      localStorage.setItem('nitro3-auth', JSON.stringify(this.refreshToken))
    } else {
      this.authenticate(username, password).then(() => {
        this.trigger('sign-in-status')
      }).catch((err) => {
        this.trigger('sign-in-error', err)
      })
    }
  }
  authHeader(json = false) {
    if (json) {
      return {
        'Authorization': 'Bearer ' + this.accessToken.access_token,
        'Content-Type': 'application/json'
      }
    }
    return 'Bearer ' + this.accessToken.access_token
  }
  createAccount(username, password) {
    return fetch(`${config.endpoint}/users/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    }).then(checkStatus).then((response) => {
      this.authenticate(username, password)
    })
  }
  deleteAccount() {
    return fetch(`${config.endpoint}/users`, {
      method: 'DELETE',
      headers: this.authHeader(true)
    }).then(checkStatus)
  }
  authenticate(username, password) {
    return new Promise((resolve, reject) => {
      fetch(`${config.endpoint}/auth/authorize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      }).then(checkStatus).then((response) => {
        response.json().then((data) => {
          this.refreshToken = data
          localStorage.setItem('nitro3-auth', JSON.stringify(this.refreshToken))
          this.getToken().then(function() {
            resolve('Logged In!')
          })
        })
      }).catch(function(err) {
        reject(err)
      })
    })
  }
  // do not use
  signOut() {
    localStorage.clear()
    window.location.reload()
  }
  getToken() {
    if (JSON.stringify(this.refreshToken) === '{}' || 'local' in this.refreshToken) {
      return
    }
    return new Promise((resolve, reject) => {
      fetch(`${config.endpoint}/auth/token/${this.refreshToken.refresh_token}`).then(checkStatus).then((response) => {
        response.json().then((data) => {
          this.accessToken = data
          this.trigger('token')
          resolve(data)
        })
      }).catch(function(err) {
        reject(err)
      })
    })
  }
}
let authenticationStore = new AuthenticationStore()
export default authenticationStore