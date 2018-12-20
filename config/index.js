import uat from './uat.json'
import prod from './prod.json'

// this *should* work for https too, but change if you need it changed
let wsendpoint = '/a/ws'
// this is required for our tests to pass
let hostname = 'localhost',
  port = '8080'
if (typeof window !== 'undefined') {
  wsendpoint = window.location.origin.replace('http', 'ws') + wsendpoint
  hostname = window.location.hostname
  port = window.location.port
}
const config = {
  endpoint: '/a',
  wsendpoint: wsendpoint,
  loginType: ['password', 'auth0'],
  publicPathOverride: null,
  auth0: {
    domain: '',
    clientID: '',
    audience: '',
    redirectUri: `http://${hostname}:${port}/callback`,
    responseType: 'token id_token',
    scope: 'openid read:tasks write:tasks'
  }
}

if (hostname === 'uat.nitrotasks.com') {
  Object.assign(config, uat)
} else if (hostname === 'go.nitrotasks.com') {
  Object.assign(config, prod)
}
if (config.publicPathOverride !== null) {
  __webpack_public_path__ = config.publicPathOverride
}

export default config
