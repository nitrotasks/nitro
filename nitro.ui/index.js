import { AppRegistry } from 'react-native'
import App from './components/app.jsx'
import { NitroSdk } from '../nitro.sdk'
window.sdk = NitroSdk

AppRegistry.registerComponent('App', () => App)

NitroSdk.loadData().then(() => {
    AppRegistry.runApplication('App', {
      rootTag: document.getElementById('app-shell')
    })
})