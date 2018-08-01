import React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'

import { vars } from '../styles.js'
import { ModalService } from '../services/modalService.js'

export class Modal extends React.Component {
  state = {
    show: false
  }
  confirmCallback = null
  componentWillMount() {
    ModalService.bind('show', this.showModal)
  }
  componentWillUnmount() {
    ModalService.unbind('show', this.showModal)
  }
  showModal = options => {
    this.confirmCallback = options.confirmAction
    this.setState({
      show: true
    })
  }
  triggerConfirm = () => {
    if (this.confirmCallback) {
      this.confirmCallback()
    }
    this.setState({
      show: false
    })
    this.confirmCallback = null
  }
  triggerCancel = () => {
    this.setState({
      show: false
    })
  }
  render() {
    if (this.state.show === false) {
      return null
    }
    return (
      <View style={styles.wrapper}>
        <View style={styles.messageWrapper}>
          <Text style={styles.message}>Are you sure you want to do this?</Text>
        </View>
        <View style={styles.buttonBox}>
          <View style={styles.button}>
            <Button
              color={vars.accentColorMuted}
              title="Cancel"
              onPress={this.triggerCancel}
            />
          </View>
          <View style={styles.button}>
            <Button
              color={vars.confirmColor}
              title="Confirm"
              onPress={this.triggerConfirm}
            />
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
    backgroundColor: '#fff',
    paddingTop: vars.padding,
    paddingBottom: vars.padding
  },
  messageWrapper: {
    padding: vars.padding / 2
  },
  message: {
    fontFamily: vars.fontFamily,
    fontSize: vars.modalFontSize,
    textAlign: 'center'
  },
  buttonBox: {
    flexDirection: 'row',
    padding: vars.padding / 2
  },
  button: {
    flex: 1,
    padding: vars.padding / 2
  }
})
