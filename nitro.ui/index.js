// polyfills
import 'intersection-observer'
import './helpers/broadcastChannel'
import smoothscroll from 'smoothscroll-polyfill'
smoothscroll.polyfill()

// deprecated but uhhh
import 'resize-observer-polyfill/dist/ResizeObserver.global'

// react
import React from 'react'
import ReactDOM from 'react-dom'
import './helpers/mousetrapGlobal.js'
import { NitroSdk } from '../nitro.sdk'
window.sdk = NitroSdk
import App from './components/app.jsx'

// css
import './external-css/fonts.css'
import './external-css/daypicker.css'
import './external-css/extras.css'
import './external-css/root.css'

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname === '/signout') {
    NitroSdk.signOut(null, true)
    return
  }
  if (
    process.env.NODE_ENV === 'production' &&
    process.env.BUILD_ENV === 'modern'
  ) {
    const Runtime = require('offline-plugin/runtime')
    Runtime.install()
  } else {
    console.info('Service Worker is disabled in development.')
  }

  const shell = document.getElementById('app-shell')
  NitroSdk.dataLoaded = NitroSdk.loadData()
    .then(() => {
      ReactDOM.render(<App />, shell)
    })
    .catch(err => {
      console.error(err)
      const headerText = '<h2>Nitro: Fatal Error!</h2>'
      let bodyText = `
        <p>
          Sign out, and hopefully your issue will be fixed when you sign back in.
        </p>
        <button onclick="window.sdk.signOut()">Sign Out</button>
        <h3>Error Message</h3>
        ${err.message}
      `
      if (
        err.message.toLowerCase().match('indexeddb') ||
        err.message.match('database')
      ) {
        bodyText = `
          <p>IndexedDB is not supported in this browser! The most likely reasons for this are either:</p>
          <ul>
            <li>You are currently private browsing</li>
            <li>Your browser is outdated</li>
          </ul>
          <p>Please contact support if you have further issues.</p>
        `
      }
      shell.innerHTML = headerText + bodyText
      shell.style.fontFamily = 'sans-serif'
      shell.style.padding = '25px'
    })
})

// we have fancy single page routing that does this for us
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}
