import { NitroSdk } from '../../../nitro.sdk'

export class _browser {
  constructor(props) {
  }
  setTitle(title) {
    if (NitroSdk.isSignedIn()) {
      document.title = `${title} - Nitro`
    }
  }
}
export let BrowserStore = new _browser()