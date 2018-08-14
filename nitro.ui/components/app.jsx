import React from 'react'
import { Router } from 'react-router-dom'
import { DragDropContext } from 'react-beautiful-dnd'
import createBrowserHistory from 'history/createBrowserHistory'
const history = createBrowserHistory()

import { NitroSdk } from '../../nitro.sdk'
import { UiService } from '../services/uiService.js'
import { Shell } from './shell/index.jsx'
import { Login } from './login/index.jsx'
import { ContextMenu } from './contextMenu.jsx'
import { Modal } from './modal.jsx'

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
  triggerDragEnd = result => {
    if (!result.destination) {
      return
    }
    if (result.source.index === result.destination.index) {
      return
    }

    const order = UiService.state.currentListOrder.slice()
    order.splice(result.source.index, 1)
    order.splice(result.destination.index, 0, result.draggableId)
    NitroSdk.updateOrder(UiService.state.currentList, order)
  }
  render() {
    if (!this.state.signedIn) {
      return <Login />
    }
    return (
      <React.Fragment>
        <Router history={history}>
          <DragDropContext onDragEnd={this.triggerDragEnd}>
            <Shell />
          </DragDropContext>
        </Router>
        <Modal />
        <ContextMenu />
      </React.Fragment>
    )
  }
}
export default App
