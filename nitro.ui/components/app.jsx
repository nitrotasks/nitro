import React from 'react'
import { View, StyleSheet } from 'react-native'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { TransitionGroup, Transition } from 'react-transition-group'

import { NitroSdk } from '../../nitro.sdk'
import { TasksExpandedService } from '../services/tasksExpandedService.js'
import { Login } from './login/index.jsx'
import { Lists } from './lists/index.jsx'
import { Tasks } from './tasks/index.jsx'
import { ContextMenu } from './contextMenu.jsx'

class App extends React.Component {
  state = {
    signedIn: NitroSdk.isSignedIn()
  }
  componentDidMount() {
    NitroSdk.bind('sign-in-status', this.signInCallback)
  }
  componentWillUnmount() {
    NitroSdk.unbind('sign-in-status', this.signInCallback)
  }
  signInCallback = () => {
    setTimeout(() => {
      this.setState({
        signedIn: NitroSdk.isSignedIn()
      })
    }, 350) // should be ample time for the animation
  }
  render() {
    if (!this.state.signedIn) {
      return <Login />
    }
    return (
      <View style={styles.wrapper}>
        <MainNavigation />
        <ContextMenu />
      </View>
    )
  }
}
const MainNavigation = ({ children }) => (
  <BrowserRouter>
    <Switch>
      <Route
        path="/:list/:task?"
        render={routeProps => {
          TasksExpandedService.routeUpdate(routeProps)
          return <Tasks {...routeProps} />
        }}
      />
      <Route path="/" render={routeProps => <Lists {...routeProps} />} />
    </Switch>
  </BrowserRouter>
)
const styles = StyleSheet.create({
  wrapper: {
    minHeight: '100vh'
  }
})
export default App
