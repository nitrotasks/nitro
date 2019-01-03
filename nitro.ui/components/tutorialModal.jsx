import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'

import { vars } from '../styles.js'
import { NitroSdk } from '../../nitro.sdk'
import { ModalService } from '../services/modalService.js'
import { TasksExpandedService } from '../services/tasksExpandedService.js'
import { Button } from './reusable/button.jsx'
import nitroIcon from '../../assets/icons/logo.svg'

export class TutorialModal extends React.Component {
  state = {
    show: false
  }
  componentWillMount() {
    ModalService.bind('show-tutorial', this.showModal)
  }
  componentWillUnmount() {
    ModalService.unbind('show-tutorial', this.showModal)
  }
  showModal = () => {
    this.setState({ show: true })
  }
  hideModal = () => {
    this.setState({ show: false })
    NitroSdk.markTutorialCompleted()
  }
  addList = () => {
    this.hideModal()
    setTimeout(() => {
      const listId = NitroSdk.addTutorialList(
        window.innerWidth > 850 ? 'desktop' : 'mobile'
      )
      // can't use a router
      TasksExpandedService.go(`/${listId}`)
    }, 20) // at least 1 frame.
  }
  render() {
    if (this.state.show === false) {
      return null
    }
    return (
      <View style={styles.wrapper}>
        <View style={styles.innerModal} className="tutorial-modal">
          <Image
            accessibilityLabel="Nitro Icon"
            source={nitroIcon}
            resizeMode="contain"
            style={styles.nitroIcon}
          />
          <Text style={[styles.text, styles.header]}>Welcome to Nitro!</Text>
          <Text style={[styles.text, styles.body]}>
            You’re one of the first to experience the Nitro 3 beta. We’ll make
            little tweaks and big improvements as we go, based on your feedback.
          </Text>
          <Text style={[styles.text, styles.body]}>
            To help you get started, we’ve prepared a tutorial list that you can
            delete later.
          </Text>
          <View style={styles.buttonBox}>
            <View style={styles.button}>
              <Button
                color="#fff"
                textColor={vars.cancelColor}
                borderColor={vars.cancelBorderColor}
                title="No Thanks"
                onPress={this.hideModal}
              />
            </View>
            <View style={styles.button}>
              <Button
                color={vars.accentColor}
                title="Add Tutorial List"
                onPress={this.addList}
              />
            </View>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    backgroundColor: 'rgba(50, 70, 90, 0.7)'
  },
  innerModal: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100vw',
    maxWidth: '480px',
    boxShadow: '0 1px 15px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
    overflow: 'hidden',
    height: 'var(--real-height)',
    paddingLeft: vars.padding,
    paddingRight: vars.padding,
    paddingTop: vars.padding * 2,
    paddingBottom: vars.padding * 2.5
  },
  nitroIcon: {
    height: 65,
    marginBottom: vars.padding
  },
  text: {
    fontFamily: vars.fontFamily,
    textAlign: 'center',
    marginBottom: vars.padding * 1.5,
    color: '#222'
  },
  header: {
    fontSize: 22,
    fontWeight: '900'
  },
  body: {
    fontSize: 16,
    lineHeight: 16 * 1.35
  },
  buttonBox: {
    flexDirection: 'row',
    maxWidth: '400px',
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  button: {
    flex: 1,
    padding: vars.padding / 2
  }
})
