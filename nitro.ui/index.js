import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/app.jsx'
import { NitroSdk } from '../nitro.sdk'

window.sdk = NitroSdk

// polyfills
import 'intersection-observer'
import smoothscroll from 'smoothscroll-polyfill'
smoothscroll.polyfill()

// css
import './external-css/fonts.css'
import './external-css/daypicker.css'
import './external-css/extras.css'
import './external-css/root.css'

document.addEventListener('DOMContentLoaded', () => {
  if (process.env.NODE_ENV === 'production') {
    const Runtime = require('offline-plugin/runtime')
    Runtime.install()
  } else {
    console.info('Service Worker is disabled in development.')
  }

  const shell = document.getElementById('app-shell')
  NitroSdk.loadData()
    .then(() => {
      ReactDOM.render(<App />, shell)
    })
    .catch(err => {
      const fixBtn = `
      <h2>fatal error!</h2>
      <p>Sign out,
      and hopefully your issue will be fixed
      when you sign back in.</p>
      <button onclick="window.sdk.signOut()">sign out</button>
      <h3>error message</h3>`
      console.error(err)
      shell.innerHTML = fixBtn + err
    })
})

// we have fancy single page routing that does this for us
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}
