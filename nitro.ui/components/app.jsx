import React from 'react'
import { View } from 'react-native'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { TransitionGroup, Transition } from 'react-transition-group'

import { Lists } from './lists/index.jsx'
import { Tasks } from './tasks/index.jsx'
import { Editor } from './editor/index.jsx'

class App extends React.Component {
  render() {
    return (
      <View>
        <MainNavigation />
      </View>
    )
  }
}
const MainNavigation = ({ children }) => (
  <BrowserRouter>
    <Switch>
      <Route
        path="/:list/:task?"
        render={routeProps => <Tasks {...routeProps} />}
      />
      <Route path="/" render={routeProps => <Lists {...routeProps} />} />
    </Switch>
  </BrowserRouter>
)
export default App
