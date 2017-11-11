import preact from 'preact'

import authenticationStore from '../stores/auth.js'

export default class login extends preact.Component {
  state = {
    username: '',
    password: '',
    signedIn: authenticationStore.isSignedIn()
  }
  componentDidMount() {
    authenticationStore.bind('sign-in-status', this.signInCallback)
  }
  componentWillUnmount() {
    authenticationStore.unbind('sign-in-status', this.signInCallback)
  }
  triggerChange = field => {
    return e => {
      this.setState({[field]: e.currentTarget.value})
    }
  }
  triggerSignIn = (e) => {
    e.preventDefault()
    authenticationStore.formSignIn(this.state.username, this.state.password)
  }
  signInCallback = () => {
    this.setState({
      signedIn: authenticationStore.isSignedIn()
    })
  }
  render() {
    if (this.state.signedIn) {
      return
    }
    return (
      <div class="login-window">
        <div class="login-window-container">
          <h1 class="brand header-child header-left">
            <img src="/img/icons/logo.svg" alt="Nitro Logo" />
            Nitro
          </h1>
          <p>The fast and easy way to get things done.</p>
          <form onSubmit={this.triggerSignIn}>
            <label for="login-username">Email</label>
            <input value={this.state.username} onInput={this.triggerChange('username')} class="input" id="login-username" type="email" autoFocus="true" autocomplete="email" />
            <label for="login-password">Password</label>
            <input value={this.state.password} onInput={this.triggerChange('password')} class="input" id="login-password" type="password" autocomplete="password" />

            <div class="button-box">
              {/*<button class="button secondary">Sign Up</button>*/}
              <button class="button primary" onClick={this.triggerSignIn}>Log In</button>
            </div>
          </form>
          <p class="please">No account? <a href="https://nitrotasks.com">Sign Up for Nitro.</a></p>
        </div>
      </div>
    )
  }
}