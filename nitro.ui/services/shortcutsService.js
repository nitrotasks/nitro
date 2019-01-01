import mousetrap from 'mousetrap'
import { Events } from '../../nitro.sdk'

class _shortcuts extends Events {
  constructor(props) {
    super(props)
    this.isMac = navigator.platform.indexOf('Mac') > -1
    this.addDefaults()
  }
  addHotkey = key => {
    mousetrap.bind(key, e => {
      this.trigger(key, e, key)
      return false
    })
  }
  addGlobalHotkey = key => {
    const actualKey = this.isMac ? key.replace('ctrl', 'command') : key
    mousetrap.bindGlobal(actualKey, e => {
      this.trigger(key, e, key)
      return false
    })
  }
  addDefaults = () => {
    this.addHotkey('?')
    this.addHotkey('/')
    this.addHotkey('esc')
    this.addHotkey('n')
    this.addHotkey('j')
    this.addHotkey('k')
    this.addGlobalHotkey('ctrl+k')
    this.addGlobalHotkey('alt+up')
    this.addGlobalHotkey('alt+down')
    this.addGlobalHotkey('ctrl+j')
  }
}
const ShortcutsService = new _shortcuts()

export { ShortcutsService }
