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
    <Route
      render={({ location }) => (
        <TransitionGroup>
          <Transition key={location.key} timeout={300}>
            {state => {
              return (
                <Switch location={location}>
                  <Route
                    path="/:list/:task"
                    render={routeProps => (
                      <Editor {...routeProps} transitionState={state} />
                    )}
                  />
                  <Route
                    path="/:list"
                    render={routeProps => (
                      <Tasks {...routeProps} transitionState={state} />
                    )}
                  />
                  <Route
                    path="/"
                    render={routeProps => (
                      <Lists {...routeProps} transitionState={state} />
                    )}
                  />
                </Switch>
              )
            }}
          </Transition>
        </TransitionGroup>
      )}
    />
  </BrowserRouter>
)
export default App
