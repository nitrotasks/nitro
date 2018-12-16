import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import { vars } from '../styles.js'
import { Button } from './reusable/button.jsx'
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
                color="#fff"
                textColor={vars.cancelColor}
                borderColor={vars.cancelBorderColor}
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
    backgroundColor: 'rgba(50, 70, 90, 0.7)'
  },
  innerModal: {
    paddingTop: vars.padding,
    paddingBottom: vars.padding,
    paddingLeft: vars.padding,
    paddingRight: vars.padding,
    marginTop: '10vh',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '90vw',
    maxWidth: '320px',
    boxShadow: '0 1px 15px rgba(0,0,0,0.1)',
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
    textAlign: 'center',
    lineHeight: vars.modalFontSize * 1.3
  },
  buttonBox: {
    flexDirection: 'row',
    paddingTop: vars.padding,
    paddingLeft: vars.padding / 4,
    paddingRight: vars.padding / 4,
    paddingBottom: vars.padding / 4
  },
  button: {
    flex: 1,
    padding: vars.padding / 4
  }
})
