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
    // no destination or the order hasn't changed
    if (
      !result.destination ||
      result.source.index === result.destination.index
    ) {
      return
    }
    // currently not supported moving tasks to different lists
    if (
      result.source.droppableId === 'tasksDroppable' &&
      result.destination.droppableId === 'tasksDroppable'
    ) {
      const order = UiService.state.currentListTasksOrder.slice()
      order.splice(result.source.index, 1)
      order.splice(
        result.destination.index,
        0,
        result.draggableId.split('tasks-')[1]
      )
      NitroSdk.updateTasksOrder(UiService.state.currentList, order)
    } else if (
      result.source.droppableId === 'listsDroppable' &&
      result.destination.droppableId === 'listsDroppable'
    ) {
      const order = UiService.state.currentListsOrder.slice()
      order.splice(result.source.index, 1)
      order.splice(
        result.destination.index,
        0,
        result.draggableId.split('lists-')[1]
      )
      NitroSdk.updateListsOrder(order)
    }
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
