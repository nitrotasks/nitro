import { get, set, clear } from 'idb-keyval'
import auth0 from 'auth0-js'

import config from '../../config'
import Events from '../events.js'
import { checkStatus } from '../helpers/fetch.js'
import { log } from '../helpers/logger.js'
import { broadcast } from './broadcastchannel.js'

import { authEvents as EVENTS } from '../models/authEvents.js'

const SESSION_EXPIRED =
  'You have been signed out because your session has expired.'
const HOUR = 60 * 60 * 1000

class AuthenticationStore extends Events {
  constructor(props) {
    super(props)
    this.loginType = null
    this.refreshToken = {}
    this.accessToken = null
    this.expiresAt = 0
    this.socket = null
    this.reconnectDelay = 1
    this.queueCompleteSync = false

    if (config.loginType.indexOf('auth0') > -1) {
      this.auth0 = new auth0.WebAuth(config.auth0)
    }

    broadcast.bind('complete-sync', this.emitFinish)
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.getToken()
      })
      window.addEventListener('offline', () => {
        if (this.socket) {
          this.socket.close()
        }
      })
    }
  }
  loadLocal(disableToken = false) {
    get('auth').then(data => {
      if (data !== undefined) {
        this.refreshToken = data
      }
      if (disableToken === true) {
        return
      }
      this.trigger(EVENTS.SIGN_IN)
      if (
        navigator !== undefined &&
        navigator.onLine &&
        !this.isLocalAccount()
      ) {
        if (
          parseInt(this.refreshToken.expiresAt) - new Date().getTime() <
          HOUR
        ) {
          this.getToken().catch(err => {
            if (err.status === 401) {
              this.signOut(SESSION_EXPIRED)
            }
          })
        } else {
          this.accessToken = { access_token: this.refreshToken.accessToken }
          this.expiresAt = parseInt(this.refreshToken.expiresAt)
          this.scheduleToken(60 * 30) // 30 minutes
          setTimeout(this.connectSocketWithCheck, 5000)
          this.trigger(EVENTS.TOKEN_READY)
        }
      }
    })
  }
  isSignedIn(tokenCheck = false) {
    if (tokenCheck && this.isLocalAccount()) {
      return false
    }
    return Object.keys(this.refreshToken).length > 0
  }
  isConnected() {
    if (this.socket) {
      return true
    }
    return false
  }
  isLocalAccount() {
    return (
      Object.keys(this.refreshToken).length === 0 ||
      this.refreshToken.loginType === 'local'
    )
  }
  formSignIn(username, password) {
    if (username === 'local@nitrotasks.com') {
      this.refreshToken = { loginType: 'local' }
      this.trigger(EVENTS.SIGN_IN)
      set('auth', this.refreshToken)
    } else {
      this.authenticate(username, password)
        .then(() => this.trigger(EVENTS.SIGN_IN))
        .catch(err => this.trigger(EVENTS.SIGN_IN_ERROR, err))
    }
  }
  authHeader(json = false) {
    if (json) {
      return {
        Authorization: 'Bearer ' + this.accessToken.access_token,
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
    })
      .then(checkStatus)
      .then(response => {
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
      })
        .then(checkStatus)
        .then(response => {
          response.json().then(data => {
            data.loginType = 'password'
            this.refreshToken = data
            set('auth', this.refreshToken)
            this.getToken().then(function() {
              resolve('Logged In!')
            })
          })
        })
        .catch(function(err) {
          reject(err)
        })
    })
  }
  signOut(message, deleteSession = false) {
    const cb = () => {
      // Signs out even if there is an error.
      broadcast.db(0)

      if (typeof message === 'string') {
        window.location = `/?info=${encodeURIComponent(message)}`
      } else {
        window.location = '/'
      }
    }
    const promises = [clear()]
    if (
      !(JSON.stringify(this.refreshToken) === '{}' || this.isLocalAccount()) &&
      deleteSession &&
      this.refreshToken.loginType !== 'auth0'
    ) {
      promises.push(
        fetch(
          `${config.endpoint}/auth/token/${this.refreshToken.refresh_token}`,
          {
            method: 'DELETE'
          }
        )
      )
    } else if (deleteSession && this.refreshToken.loginType === 'auth0') {
      this.auth0.logout()
    }
    Promise.all(promises)
      .then(cb)
      .catch(cb)
  }
  checkToken() {
    // this ensure that there is always a valid token before a sync
    if (this.expiresAt > new Date().getTime()) {
      return Promise.resolve()
    }
    return this.getToken()
  }
  scheduleToken(time) {
    log('Getting new token in', time / 60 / 60, 'hours.')
    setTimeout(() => {
      this.getToken()
    }, Math.round(time) * 1000)
  }
  getToken() {
    if (
      JSON.stringify(this.refreshToken) === '{}' ||
      this.refreshToken.loginType === 'local'
    ) {
      return Promise.resolve()
    } else if (this.refreshToken.loginType === 'auth0') {
      return new Promise((resolve, reject) => {
        this.auth0.checkSession({}, (err, authResult) => {
          if (err) {
            this.trigger(EVENTS.UNIVERSAL_ERROR, err)
          } else if (
            authResult &&
            authResult.accessToken &&
            authResult.idToken
          ) {
            const expiresAt = JSON.stringify(
              authResult.expiresIn * 1000 + new Date().getTime()
            )
            this.refreshToken.accessToken = authResult.accessToken
            this.accessToken = { access_token: authResult.accessToken }
            this.refreshToken.idToken = authResult.idToken
            this.refreshToken.expiresAt = expiresAt
            this.expiresAt = expiresAt
            set('auth', this.refreshToken)
            log('Auth0 Session Refreshed')
            this.trigger(EVENTS.TOKEN_READY)
            this.scheduleToken(60 * 30) // 30 minutes
            this.connectSocketWithCheck()
            resolve()
          } else {
            console.error(err)
            alert(err.message)
          }
        })
      })
    } else {
      return new Promise((resolve, reject) => {
        fetch(
          `${config.endpoint}/auth/token/${this.refreshToken.refresh_token}`
        )
          .then(checkStatus)
          .then(response => {
            response.json().then(data => {
              this.accessToken = data
              this.expiresAt = new Date().getTime() + data.expiresIn * 1000
              this.scheduleToken(data.expiresIn / 4)
              this.trigger(EVENTS.TOKEN_READY)
              this.connectSocketWithCheck()
              resolve(data)
            })
          })
          .catch(function(err) {
            reject(err)
          })
      })
    }
  }
  requestUniversalAuth() {
    if (config.loginType.indexOf('auth0') > -1) {
      this.auth0.authorize()
    } else {
      throw new Error('No Auth0 Client!')
    }
  }
  handleUniversalAuth() {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          const expiresAt = JSON.stringify(
            authResult.expiresIn * 1000 + new Date().getTime()
          )
          this.refreshToken = {
            loginType: 'auth0',
            accessToken: authResult.accessToken,
            idToken: authResult.idToken,
            expiresAt: expiresAt
          }
          this.accessToken = { access_token: this.refreshToken.accessToken }
          this.expiresAt = this.refreshToken.expiresAt
          set('auth', this.refreshToken)

          return fetch(`${config.endpoint}/auth/universal`, {
            headers: this.authHeader(true)
          })
            .then(checkStatus)
            .then(response => response.json())
            .then(() => this.trigger(EVENTS.TOKEN_READY))
            .then(() => log('Signed in with Auth0'))
            .then(() => this.trigger(EVENTS.SIGN_IN))
            .then(() => this.connectSocketWithCheck())
            .then(resolve)
            .catch(err => {
              this.trigger(EVENTS.SIGN_IN_ERROR, err)
              reject(err)
            })
        } else if (err) {
          console.error(err)
          err.message = err.errorDescription
          this.trigger(EVENTS.SIGN_IN_ERROR, err)
          reject(err)
        }
      })
    })
  }
  connectSocketWithCheck = () => {
    if (broadcast.isMaster() && !this.isConnected()) {
      this.connectSocket()
    } else if (!broadcast.isMaster()) {
      log('Not connecting WebSocket, not master tab.')
    }
  }
  connectSocket = () => {
    if (!navigator.onLine) {
      log('Offline, will not try to connect WebSocket.')
      return
    }

    let token = this.refreshToken.refresh_token
    if (this.refreshToken.loginType === 'auth0') {
      token = this.accessToken.access_token
    }
    const socket = new WebSocket(`${config.wsendpoint}?token=${token}`)
    socket.onopen = () => {
      this.socket = socket
      this.reconnectDelay = 1
      this.trigger(EVENTS.WEBSOCKET, { command: 'connected' })
      log('Connected to Server via WebSocket')
      if (this.queueCompleteSync === true) {
        this.queueCompleteSync = false
        // TODO: Find out the reason why this doesn't work properly.
        // needs a timeout or doesn't work???
        setTimeout(() => {
          log('Emitting deferred complete-sync command.')
          this.emitFinish()
        }, 50)
      }
    }
    socket.onmessage = msg => {
      this.trigger(EVENTS.WEBSOCKET, JSON.parse(msg.data))
    }
    socket.onerror = err => {
      console.error(err)
    }
    socket.onclose = () => {
      this.socket = null
      if (this.reconnectDelay < 60) {
        this.reconnectDelay = this.reconnectDelay * 2
      }
      log(
        'WebSocket Disconnected. Trying again in',
        this.reconnectDelay,
        'seconds.'
      )
      setTimeout(this.connectSocket, this.reconnectDelay * 1000)
    }
  }
  emitFinish = (eventMode = false) => {
    if (this.socket !== null) {
      this.socket.send(
        JSON.stringify({
          command: 'complete-sync'
        })
      )
    } else if (!broadcast.isMaster() && eventMode === false) {
      broadcast.post('complete-sync')
    } else {
      this.queueCompleteSync = true
    }
  }
}
let authenticationStore = new AuthenticationStore()
export default authenticationStore
