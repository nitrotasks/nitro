import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { NitroSdk } from '../../nitro.sdk'
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
  render() {
    if (!this.state.signedIn) {
      return <Login />
    }
    return (
      <React.Fragment>
        <BrowserRouter>
          <Shell />
        </BrowserRouter>
        <Modal />
        <ContextMenu />
      </React.Fragment>
    )
  }
}
export default App
