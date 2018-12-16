import uat from './uat.json'
import prod from './prod.json'

// this *should* work for https too, but change if you need it changed
let wsendpoint = '/a/ws'
// this is required for our tests to pass
if (window !== undefined) {
  wsendpoint = window.location.origin.replace('http', 'ws') + wsendpoint
}
const { hostname, port } = window.location
const config = {
  endpoint: '/a',
  wsendpoint: wsendpoint,
  loginType: ['password', 'auth0'],
  auth0: {
    domain: '',
    clientID: '',
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

export default config
