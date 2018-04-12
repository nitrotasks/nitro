import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, TextInput, StyleSheet } from 'react-native'

import { NitroSdk } from '../../../nitro.sdk'
import { vars } from '../../styles.js'

export class TaskExpanded extends React.Component {
  static propTypes = {
    triggerBack: PropTypes.func
  }
  triggerOverlay = () => {
    this.props.triggerBack()
  }
  render() {
    const task = NitroSdk.getTask(this.props.match.params.task)
    let top = 0
    if (this.props.position !== null) {
      top = this.props.position
    }
    return (
      <React.Fragment>
        <View style={[styles.wrapper, { top: top }]}>
          <TextInput
            style={styles.header}
            value={task.name}
            placeholder="Task Name"
          />
          <TextInput
            style={styles.notes}
            value={task.notes || ''}
            placeholder="Notes"
            multiline={true}
            numberOfLines={3}
          />
        </View>
        <View
          style={[styles.overlay, { top: top - 100 }]}
          onClick={this.triggerOverlay}
        />
      </React.Fragment>
    )
  }
}
const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    zIndex: 10,
    left: 0,
    width: '100%',
    height: '100vh',
    backgroundColor: '#fff',
    opacity: 0.5
  },
  wrapper: {
    position: 'absolute',
    zIndex: 11,
    left: 0,
    width: '100%',
    backgroundColor: '#fff',
    padding: vars.padding,
    boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
  },
  header: {
    fontSize: vars.taskExpandedFontSize,
    outline: '0'
  },
  notes: {
    fontSize: vars.taskFontSize,
    paddingTop: vars.padding,
    outline: '0'
  }
})
