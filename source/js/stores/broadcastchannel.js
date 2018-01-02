import Events from '../models/events.js'
import { log } from '../helpers/logger.js'

export class _broadcast extends Events {
  constructor(props) {
    super(props)
    // TODO: Polyfill this!
    this.dbtimeout = null
    this.bctimeout = 0
    this.bc = null
    this.mastertab = true
    if (typeof self !== 'undefined' && 'BroadcastChannel' in self) {
      this.bc = new BroadcastChannel('nitro3-updates')
      this.bc.onmessage = this.handleMessage
      this.bc.postMessage('broadcast')
      setInterval(this.checkBroadcast, 10000)
    }
  }
  checkBroadcast = () => {
    if (this.mastertab === true) return
    this.bc.postMessage('broadcast')
    // wait 2500 seconds for a reply, should get cancelled if not master
    this.bctimeout = setTimeout(() => {
      log('This tab is the new master tab.')
      this.mastertab = true
    }, 2500)
  }
  post(msg) {
    if (this.bc) {
      return this.bc.postMessage(msg)
    }
  }
  db = () => {
    if (this.dbtimeout !== null) return
    this.dbtimeout = setTimeout(() => {
      log('Broadcasting to other tabs.')
      this.post('refresh-db')
      this.dbtimeout = null
    }, 1000) // arbitrary amount of time.
  }
  isMaster() {
    return this.mastertab
  }
  handleMessage = (broadcastmessage) => {
    const msg = broadcastmessage.data
    if (msg === 'refresh-db' || msg === 'complete-sync') {
      // combinedCollection picks up this event, and tells other models to load data
      this.trigger(msg, 'event')
    } else if (msg === 'broadcast' && this.mastertab === true) {
      // we are master tab
      this.bc.postMessage('master')
    } else if (msg === 'master') {
      // we are not master tab, so we won't be connecting any websockets
      this.mastertab = false
      clearTimeout(this.bctimeout)
    }
  }
}
export let broadcast = new _broadcast()