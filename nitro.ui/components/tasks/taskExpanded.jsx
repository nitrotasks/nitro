import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import { NitroSdk } from '../../../nitro.sdk'

export class TaskExpanded extends React.Component {
  render() {
    const task = NitroSdk.getTask(this.props.match.params.task)
    let top = 0
    if (this.props.position !== null) {
      top = this.props.position
    }
    return (
      <View style={[styles.wrapper, { top: top }]}>
        <Text>{task.name}</Text>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  wrapper: {
    position: 'fixed',
    left: 0,
    height: 56,
    backgroundColor: '#0f0'
  }
})
