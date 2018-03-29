import { AppRegistry } from 'react-native'
import App from './components/app.jsx'

AppRegistry.registerComponent('App', () => App)

AppRegistry.runApplication('App', {
  rootTag: document.getElementById('app-shell')
})