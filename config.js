// this *should* work for https too, but change if you need it changed
let wsendpoint = '/a/ws'
// this is required for our tests to pass
if (typeof window !== 'undefined') {
  wsendpoint = window.location.origin.replace('http', 'ws') + wsendpoint
}
const config = {
  endpoint: '/a',
  wsendpoint: wsendpoint,
  loginType: ['password', 'auth0'],
  auth0: {
    domain: '',
    clientID: '',
    redirectUri: 'http://localhost:8080/callback',
    responseType: 'token id_token',
    scope: 'openid'
  }
}
export default config
