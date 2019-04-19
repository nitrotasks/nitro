import React from 'react'
import { string } from 'prop-types'
import { View, TextInput, StyleSheet } from 'react-native'
import { vars } from '../../styles.js'
import { ShortcutsService } from '../../services/shortcutsService.js'

import { NitroSdk } from '../../../nitro.sdk'

const FOCUS_HOTKEY = 'n'
const GLOBAL_FOCUS_HOTKEY = 'ctrl+j'

export class TasksInput extends React.Component {
  static propTypes = {
    listId: string
  }
  state = {
    name: '',
    inputFocus: false
  }
  input = React.createRef()

  componentDidMount() {
    ShortcutsService.bind(FOCUS_HOTKEY, this.triggerHotkey)
    ShortcutsService.bind(GLOBAL_FOCUS_HOTKEY, this.triggerHotkey)
  }
  componentWillUnmount() {
    ShortcutsService.unbind(FOCUS_HOTKEY, this.triggerHotkey)
    ShortcutsService.unbind(GLOBAL_FOCUS_HOTKEY, this.triggerHotkey)
  }
  triggerHotkey = () => {
    this.input.current.focus()
  }
  triggerChange = e => {
    this.setState({ name: e.currentTarget.value })
  }
  triggerFocus = () => {
    this.setState({
      inputFocus: true
    })
  }
  triggerBlur = () => {
    this.setState({
      inputFocus: false
    })
  }
  triggerKeyUp = e => {
    // ESC
    if (e.keyCode === 27) {
      e.currentTarget.blur()
    }
  }
  triggerSubmit = e => {
    const name = this.state.name.trim()
    if (name === '') return
    NitroSdk.addTask({
      name: name,
      list: this.props.listId
    })
    this.setState({
      name: ''
    })
    e.currentTarget.focus()
  }
  render() {
    const inputStyles = this.state.inputFocus
      ? [styles.input, styles.inputFocus]
      : styles.input
    return (
      <View style={styles.wrapper} className="mobile-hidden">
        <TextInput
          ref={this.input}
          className="hover-input"
          autoComplete="off"
          style={inputStyles}
          value={this.state.name}
          onChange={this.triggerChange}
          onFocus={this.triggerFocus}
          onBlur={this.triggerBlur}
          onKeyUp={this.triggerKeyUp}
          onSubmitEditing={this.triggerSubmit}
          blurOnSubmit={false}
          placeholder="Add a task..."
        />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  wrapper: {
    paddingTop: vars.padding / 4,
    paddingLeft: vars.padding / 2,
    paddingRight: vars.padding / 2,
    paddingBottom: (vars.padding * 3) / 4
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'transparent',
    paddingTop: vars.padding / 2,
    paddingLeft: (vars.padding * 3) / 4,
    paddingRight: (vars.padding * 3) / 4,
    paddingBottom: vars.padding / 2,
    borderRadius: 4,
    outlineWidth: 0,
    fontFamily: vars.fontFamily,
    fontSize: vars.taskInputFontSize,
    lineHeight: vars.padding * 1.125,
    transitionDuration: '250ms, 250ms',
    transitionProperty: 'border-color, background-color',
    transitionTimingFunction: 'ease, ease'
  },
  inputFocus: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderColor: vars.accentColor
  }
})
