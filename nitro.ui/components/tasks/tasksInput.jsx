import React from 'react'
import PropTypes from 'prop-types'
import { TextInput, StyleSheet } from 'react-native'

import { NitroSdk } from '../../../nitro.sdk'

export class TasksInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      inputFocus: false
    }
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
    NitroSdk.addTask({
      name: this.state.name.trim(),
      list: this.props.listId
    })
    this.setState({
      name: ''
    })
    e.currentTarget.blur()
  }
  render() {
    return (
      <TextInput
        value={this.state.name}
        onChange={this.triggerChange}
        onFocus={this.triggerFocus}
        onBlur={this.triggerBlur}
        onKeyUp={this.triggerKeyUp}
        onSubmitEditing={this.triggerSubmit}
        placeholder="Add a task..."
      />
    )
  }
}
TasksInput.propTypes = {
  listId: PropTypes.string
}
