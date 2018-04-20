import React from 'react'
import { View, Text, Image, StyleSheet, TextInput, Button } from 'react-native'

import logo from '../../../assets/icons/logo.svg'
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
  }
  componentWillUnmount() {
    NitroSdk.unbind('sign-in-status', this.signInCallback)
    NitroSdk.unbind('sign-in-error', this.signInError)
  }
  triggerChange = field => {
    return e => {
      this.setState({ [field]: e.currentTarget.value })
      console.log(e.currentTarget.value)
    }
  }
  triggerSignIn = e => {
    e.preventDefault()
    this.setState({ disabled: true })
    console.log('triggeerrr.r.r.r')
    NitroSdk.signIn(this.state.username, this.state.password)
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
    return (
      <View style={styles.wrapper}>
        <View style={styles.branding}>
          <View style={styles.logoContainer}>
            <Image
              style={styles.logo}
              accessibilityLabel="Nitro Logo"
              source={logo}
              resizeMode="contain"
            />
          </View>
          <View>
            <Text style={styles.header}>Nitro</Text>
          </View>
        </View>
        <Text style={styles.tagline}>
          The fast and easy way to get things done.
        </Text>
        <Text style={styles.label} htmlFor="login-username">
          Email
        </Text>
        <TextInput
          style={styles.input}
          value={this.state.username}
          onChange={this.triggerChange('username')}
          id="login-username"
          type="email"
          autoFocus={true}
          autoComplete="email"
        />
        <Text style={styles.label} htmlFor="login-password">
          Password
        </Text>
        <TextInput
          style={styles.input}
          value={this.state.password}
          onChange={this.triggerChange('password')}
          id="login-password"
          type="password"
          autoComplete="password"
        />

        <Button
          onPress={this.triggerSignIn}
          disabled={this.state.disabled}
          color={vars.accentColor}
          title={text}
        />
        <View style={styles.signUpWrapper}>
          <Text style={styles.signUp}>
            No account? <a href="https://nitrotasks.com">Sign Up for Nitro.</a>
          </Text>
        </View>
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
    padding: vars.padding * 2
  },
  branding: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vars.padding
  },
  logoContainer: {
    marginRight: vars.padding / 2,
    width: vars.padding * 1.75
  },
  logo: {
    height: vars.padding * 3
  },
  header: {
    fontSize: vars.padding * 2,
    textAlign: 'center',
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  tagline: {
    color: vars.taskTextColor,
    fontSize: vars.padding * 1.125,
    maxWidth: 200,
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center'
  },
  label: {
    fontWeight: '600',
    color: vars.taskTextColor,
    marginTop: vars.padding / 4,
    marginBottom: vars.padding / 4,
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
    marginBottom: vars.padding * 0.75,
    width: '100%',
    outline: '0'
  },
  signUpWrapper: {
    marginTop: vars.padding
  },
  signUp: {
    fontSize: vars.padding,
    textAlign: 'center'
  }
})
