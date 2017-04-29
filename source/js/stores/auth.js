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
  authHeader(json = false) {
    if (json) {
      return {
        'Authorization': 'Bearer ' + this.accessToken.access_token,
        'Content-Type': 'application/json'
      }
    }
    return 'Bearer ' + this.accessToken.access_token
  }
  authenticate(username, password) {
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
          console.log('Logged in!')
        })
      })
    }).catch(function(err) {
      console.error(err.response)
    })
  }
  getToken() {
    if (JSON.stringify(this.refreshToken) === '{}') {
      return
    }
    return new Promise((resolve, reject) => {
      fetch(`${config.endpoint}/auth/token/${this.refreshToken.refresh_token}`).then(checkStatus).then((response) => {
        response.json().then((data) => {
          this.accessToken = data
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