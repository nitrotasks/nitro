// this *should* work for https too, but change if you need it changed
const wsendpoint = window.location.origin.replace('http', 'ws') + '/a/ws'
const config = {
  endpoint: '/a',
  wsendpoint: wsendpoint
}
export default config
