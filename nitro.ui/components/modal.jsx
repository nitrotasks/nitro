import React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'

import { vars } from '../styles.js'
import { ModalService } from '../services/modalService.js'

const DEFAULT_MESSAGE = 'Are you sure you want to do this?'
const DEFAULT_CONFIRM = 'Confirm'
const DEFAULT_CONFIRM_COLOR = vars.positiveColor
const DEFAULT_CANCEL = 'Cancel'
export class Modal extends React.Component {
  state = {
    confirmText: DEFAULT_CONFIRM,
    confirmColor: DEFAULT_CONFIRM_COLOR,
    cancelText: DEFAULT_CANCEL,
    message: DEFAULT_MESSAGE,
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
      confirmText: options.confirmText || DEFAULT_CONFIRM,
      confirmColor: options.confirmColor || DEFAULT_CONFIRM_COLOR,
      cancelText: options.cancelText || DEFAULT_CANCEL,
      message: options.message || DEFAULT_MESSAGE,
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
        <View style={styles.innerModal}>
          <View style={styles.messageWrapper}>
            <Text style={styles.message}>{this.state.message}</Text>
          </View>
          <View style={styles.buttonBox}>
            <View style={styles.button}>
              <Button
                color={vars.accentColorMuted}
                title={this.state.cancelText}
                onPress={this.triggerCancel}
              />
            </View>
            <View style={styles.button}>
              <Button
                color={this.state.confirmColor}
                title={this.state.confirmText}
                onPress={this.triggerConfirm}
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
    backgroundColor: 'rgba(255,255,255,0.5)'
  },
  innerModal: {
    paddingTop: vars.padding,
    paddingBottom: vars.padding,
    paddingLeft: vars.padding,
    paddingRight: vars.padding,
    marginTop: vars.padding * 2,
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: '320px',
    boxShadow: '0 1px 5px rgba(0,0,0,0.25)',
    borderRadius: '5px',
    backgroundColor: '#fff'
  },
  messageWrapper: {
    padding: vars.padding,
    paddingBottom: vars.padding / 2
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
