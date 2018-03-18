import preact from 'preact'

import authenticationStore from '../stores/auth.js'
import logoSvg from '../../../assets/icons/logo.svg'

export default class login extends preact.Component {
  state = {
    username: '',
    password: '',
    signedIn: authenticationStore.isSignedIn(),
    disabled: false,
  }
  componentDidMount() {
    authenticationStore.bind('sign-in-status', this.signInCallback)
    authenticationStore.bind('sign-in-error', this.signInError)
  }
  componentWillUnmount() {
    authenticationStore.unbind('sign-in-status', this.signInCallback)
    authenticationStore.unbind('sign-in-error', this.signInError)
  }
  triggerChange = field => {
    return e => {
      this.setState({ [field]: e.currentTarget.value })
    }
  }
  triggerSignIn = e => {
    e.preventDefault()
    this.setState({ disabled: true })
    authenticationStore.formSignIn(this.state.username, this.state.password)
  }
  signInCallback = () => {
    this.setState({
      signedIn: authenticationStore.isSignedIn(),
      disabled: false,
    })
  }
  signInError = (err) => {
    alert(err)
    this.setState({ disabled: false })
  }
  render() {
    if (this.state.signedIn) {
      return
    }
    let text = 'Log In'
    if (this.state.disabled) {
      text = 'Logging in...'
    }
    return (
      <div class="login-window">  
        <div class="login-window-container">
          <h1 class="brand header-child header-left">
            <img src={logoSvg} alt="" />
            Nitro
          </h1>
          <p>The fast and easy way to get things done.</p>
          <form onSubmit={this.triggerSignIn}>
            <label for="login-username">Email</label>
            <input
              value={this.state.username}
              onInput={this.triggerChange('username')}
              class="input"
              id="login-username"
              type="email"
              autoFocus="true"
              autocomplete="email"
            />
            <label for="login-password">Password</label>
            <input
              value={this.state.password}
              onInput={this.triggerChange('password')}
              class="input"
              id="login-password"
              type="password"
              autocomplete="password"
            />

            <div class="button-box">
              {/*<button class="button secondary">Sign Up</button>*/}
              <button
                class="button primary"
                onClick={this.triggerSignIn}
                disabled={this.state.disabled}
              >
                {text}
              </button>
            </div>
          </form>
          <p class="please">
            No account? <a href="https://nitrotasks.com">Sign Up for Nitro.</a>
          </p>
        </div>
      </div>
    )
  }
}
