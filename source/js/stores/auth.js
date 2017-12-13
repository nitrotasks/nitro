import db from 'idb-keyval'
import config from '../../../config.js'
import Events from '../models/events.js'
import { checkStatus } from '../helpers/fetch.js'
import { log } from '../helpers/logger.js'

class AuthenticationStore extends Events {
  constructor(props) {
    super(props)
    this.refreshToken = {}
    this.accessToken = null
    this.expiresAt = 0
    this.socket = null
    this.reconnectDelay = 1

    db.get('auth').then((data) => {
      if (typeof data !== 'undefined') {
        this.refreshToken = data
      }
      this.trigger('sign-in-status')
      if (navigator.onLine) {
        this.getToken().catch((err) => {
          if (err.status === 401) {
            alert('You have been signed out.')
            this.signOut()
          }
        })
      }
    })
    window.addEventListener('online', () => {
      this.getToken()
    })
    window.addEventListener('offline', () => {
      if (this.socket) {
        this.socket.close()
      }
    })
  }
  isSignedIn(tokenCheck = false) {
    if (tokenCheck && typeof this.refreshToken.local !== 'undefined' && this.refreshToken.local === true) {
      return false
    }
    return Object.keys(this.refreshToken).length > 0
  }
  formSignIn(username, password) {
    if (username === 'local@nitrotasks.com') {
      this.refreshToken = {local: true}
      this.trigger('sign-in-status')
      db.set('auth', this.refreshToken)
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
          db.set('auth', this.refreshToken)
          this.getToken().then(function() {
            resolve('Logged In!')
          })
        })
      }).catch(function(err) {
        reject(err)
      })
    })
  }
  signOut() {
    if (JSON.stringify(this.refreshToken) === '{}' || 'local' in this.refreshToken) {
      return db.clear().then(() => {
        window.location = '/'
      })
    }
    Promise.all([
      db.clear(),
      fetch(`${config.endpoint}/auth/token/${this.refreshToken.refresh_token}`, {
        method: 'DELETE'
      })
    ]).then(() => {
      window.location = '/'
    })
  }
  // this ensure that there is always a valid token before a sync
  checkToken() {
    if (this.expiresAt > new Date().getTime()) {
      return Promise.resolve()
    }
    return this.getToken()
  }
  scheduleToken(time) {
    log('Getting new token in', Math.round(time / 60 / 60), 'hours.')
    setTimeout(() => {
      this.getToken()
    }, Math.round(time) * 1000)
  }
  getToken() {
    if (JSON.stringify(this.refreshToken) === '{}' || 'local' in this.refreshToken) {
      return Promise.resolve()
    }
    return new Promise((resolve, reject) => {
      fetch(`${config.endpoint}/auth/token/${this.refreshToken.refresh_token}`).then(checkStatus).then((response) => {
        response.json().then((data) => {
          this.accessToken = data
          this.expiresAt = new Date().getTime() + (data.expiresIn * 1000)
          this.scheduleToken(data.expiresIn / 4)
          this.trigger('token')
          this.connectSocket()
          resolve(data)
        })
      }).catch(function(err) {
        reject(err)
      })
    })
  }
  connectSocket = () => {
    if (!navigator.onLine) {
      log('Offline, will not try to connect WebSocket.')
      return
    }

    const socket = new WebSocket(`${config.wsendpoint}?token=${this.refreshToken.refresh_token}`)
    socket.onopen = () => {
      this.socket = socket
      this.reconnectDelay = 1
      log('Connected to Server via WebSocket')
    }
    socket.onmessage = (msg) => {
      this.trigger('ws', JSON.parse(msg.data))
    }
    socket.onerror = (err) => {
      console.error(err)
    }
    socket.onclose = () => {
      this.socket = null
      if (this.reconnectDelay < 60) {
        this.reconnectDelay = this.reconnectDelay * 2
      }
      log('WebSocket Disconnected. Trying again in', this.reconnectDelay, 'seconds.')
      setTimeout(this.connectSocket, this.reconnectDelay * 1000)
    }
  }
  emitFinish = () => {
    if (this.socket !== null) {
      this.socket.send(JSON.stringify({
        command: 'complete-sync'
      }))
    }
  }
}
let authenticationStore = new AuthenticationStore()
export default authenticationStore