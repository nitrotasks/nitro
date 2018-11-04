import React from 'react'
import { View, Text, Image, StyleSheet, TextInput, Button } from 'react-native'

import config from '../../../config.js'
import logo from '../../../assets/icons/full-logo.svg'
import { NitroSdk } from '../../../nitro.sdk'
import { vars } from '../../styles.js'

export class Login extends React.Component {
  state = {
    username: '',
    password: '',
    signedIn: NitroSdk.isSignedIn(),
    disabled: false
  }
  componentDidMount() {
    NitroSdk.bind('sign-in-status', this.signInCallback)
    NitroSdk.bind('sign-in-error', this.signInError)

    if (/access_token|id_token|error/.test(window.location.hash)) {
      NitroSdk.handleUniversalAuth()
        .then(data => {
          console.log('TODO: redirect to home page')
        })
        .catch(err => {
          this.signInError(err.message)
        })
    }
  }
  componentWillUnmount() {
    NitroSdk.unbind('sign-in-status', this.signInCallback)
    NitroSdk.unbind('sign-in-error', this.signInError)
  }
  triggerChange = field => {
    return e => {
      this.setState({ [field]: e.currentTarget.value })
    }
  }
  triggerSignIn = e => {
    e.preventDefault()
    this.setState({ disabled: true })
    NitroSdk.signIn(this.state.username, this.state.password)
  }
  triggerUniversalAuth = () => {
    NitroSdk.requestUniversalAuth()
  }
  triggerKeyPress = e => {
    if (e.nativeEvent.key === 'Enter') {
      this.triggerSignIn(e)
    }
  }
  signInCallback = () => {
    this.setState({
      signedIn: NitroSdk.isSignedIn(),
      disabled: false
    })
  }
  signInError = err => {
    alert(err)
    this.setState({ disabled: false })
  }
  render() {
    const text = this.state.disabled ? 'Logging in...' : 'Log In'
    const wrapperStyles = NitroSdk.isSignedIn()
      ? [styles.wrapper, styles.wrapperHidden]
      : styles.wrapper

    const passwordBlock =
      config.loginType.indexOf('password') > -1 ? (
        <React.Fragment>
          <Text style={styles.label} htmlFor="login-username">
            Email
          </Text>
          <TextInput
            style={styles.input}
            value={this.state.username}
            onChange={this.triggerChange('username')}
            id="login-username"
            keyboardType="email-address"
            autoFocus={true}
            autoComplete="email"
          />
          <Text style={styles.label} htmlFor="login-password">
            Password
          </Text>
          <TextInput
            style={styles.input}
            value={this.state.password}
            onKeyPress={this.triggerKeyPress}
            onChange={this.triggerChange('password')}
            id="login-password"
            secureTextEntry={true}
            autoComplete="password"
          />
          <Button
            onPress={this.triggerSignIn}
            disabled={this.state.disabled}
            color={vars.accentColor}
            title={text}
          />
        </React.Fragment>
      ) : null

    const auth0Block =
      config.loginType.indexOf('auth0') > -1 ? (
        <View style={styles.universalLogin}>
          <Button
            onPress={this.triggerUniversalAuth}
            color={vars.accentColor}
            title={passwordBlock ? 'Universal Login' : 'Sign In'}
          />
        </View>
      ) : null

    let content
    if (window.location.pathname === '/callback') {
      content = <Text style={styles.tagline}>Signing In...</Text>
    } else {
      content = (
        <React.Fragment>
          <Text style={styles.tagline}>
            The fast and easy way to get things done.
          </Text>
          {passwordBlock}
          {auth0Block}
          <View style={styles.signUpWrapper}>
            <Text style={styles.signUp}>
              No account?{' '}
              <a href="https://nitrotasks.com">Sign Up for Nitro.</a>
            </Text>
          </View>
        </React.Fragment>
      )
    }
    return (
      <View style={wrapperStyles}>
        <View style={styles.branding}>
          <Image
            style={styles.logo}
            accessibilityLabel="Nitro Logo"
            source={logo}
            resizeMode="contain"
          />
        </View>
        {content}
      </View>
    )
  }
}
const styles = StyleSheet.create({
  wrapper: {
    maxWidth: 400 - vars.padding * 2,
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: vars.padding * 2,
    transitionDuration: '300ms',
    transitionProperty: 'opacity',
    transitionTimingFunction: 'ease',
    opacity: 1
  },
  wrapperHidden: {
    opacity: 0
  },
  branding: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vars.padding
  },
  logo: {
    height: vars.padding * 3,
    width: vars.padding * 9.5
  },
  header: {
    fontSize: vars.padding * 2,
    textAlign: 'center',
    fontFamily: vars.fontFamily,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  tagline: {
    color: vars.taskTextColor,
    fontFamily: vars.fontFamily,
    fontSize: vars.padding * 1.125,
    maxWidth: 200,
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center'
  },
  label: {
    fontWeight: '600',
    color: vars.taskTextColor,
    lineHeight: vars.padding * 1.5,
    fontFamily: vars.fontFamily,
    fontSize: vars.padding * 0.875
  },
  input: {
    display: 'block',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 3,
    paddingTop: vars.padding / 2,
    paddingBottom: vars.padding / 2,
    paddingLeft: vars.padding / 2,
    paddingRight: vars.padding / 2,
    backgroundColor: 'rgba(0,0,0,0.08)',
    fontFamily: vars.fontFamily,
    marginBottom: vars.padding * 0.75,
    width: '100%',
    outline: '0'
  },
  universalLogin: {
    marginTop: vars.padding * 2,
    marginBottom: vars.padding
  },
  signUpWrapper: {
    marginTop: vars.padding
  },
  signUp: {
    fontFamily: vars.fontFamily,
    fontSize: vars.padding,
    textAlign: 'center'
  }
})
