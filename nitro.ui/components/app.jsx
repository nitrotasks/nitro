import React from 'react'
import { View } from 'react-native'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import { Lists } from './lists/index.jsx'
import { Tasks } from './tasks/index.jsx'
import { Editor } from './editor/index.jsx'

class App extends React.Component {
  render() {
    return (
      <View>
        <BrowserRouter>
          <Switch>
            <Route path="/:list/:task" component={Editor} />
            <Route path="/:list" component={Tasks} />
            <Route path="/" component={Lists} />
          </Switch>
        </BrowserRouter>
      </View>
    )
  }
}
export default App