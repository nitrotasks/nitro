import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import { vars } from '../styles.js'
import { ModalService } from '../services/modalService.js'
import { ShortcutsService } from '../services/shortcutsService.js'

const TOGGLE_HOTKEY = '?'
const CLOSE_HOTKEY = 'esc'
export class ShortcutsModal extends React.Component {
  state = {
    show: false
  }
  confirmCallback = null
  componentWillMount() {
    ModalService.bind('show-shortcuts', this.showModal)
    ShortcutsService.bind(TOGGLE_HOTKEY, this.toggleModal)
    ShortcutsService.bind(CLOSE_HOTKEY, this.hideModal)
  }
  componentWillUnmount() {
    ModalService.unbind('show-shortcuts', this.showModal)
    ShortcutsService.unbind(TOGGLE_HOTKEY, this.toggleModal)
    ShortcutsService.unbind(CLOSE_HOTKEY, this.hideModal)
  }
  showModal = () => {
    this.setState({ show: true })
  }
  hideModal = () => {
    this.setState({ show: false })
  }
  toggleModal = () => {
    this.setState({ show: !this.state.show })
  }
  render() {
    if (this.state.show === false) {
      return null
    }
    return (
      <View style={styles.wrapper}>
        <View style={styles.innerModal}>
          <View>
            <Text>Keyboard Shortcuts</Text>
          </View>
          <View style={styles.messageWrapper}>
            <Text style={styles.message}>Keyboard Shortcuts Modal</Text>
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
  }
})
