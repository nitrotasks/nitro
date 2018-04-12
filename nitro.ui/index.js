import { AppRegistry } from 'react-native'
import App from './components/app.jsx'
import { NitroSdk } from '../nitro.sdk'
window.sdk = NitroSdk

AppRegistry.registerComponent('App', () => App)

document.addEventListener('DOMContentLoaded', () => {
  const shell = document.getElementById('app-shell')
  NitroSdk.loadData()
    .then(() => {
      AppRegistry.runApplication('App', {
        rootTag: shell
      })
    })
    .catch(err => {
      shell.innerHTML = err
    })
})

// we have fancy single page routing that does this for us
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}
