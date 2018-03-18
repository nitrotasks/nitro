import authenticationStore from './auth.js'

export class _browser {
  constructor(props) {
  }
  setTitle(title) {
    if (authenticationStore.isSignedIn()) {
      document.title = `${title} - Nitro`
    }
  }
}
export let BrowserStore = new _browser()