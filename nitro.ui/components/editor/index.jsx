import React from 'react'
import { View, Text } from 'react-native'

import { NitroSdk } from '../../../nitro.sdk'
import { MaterialHeader } from '../materialHeader.jsx'

export class Editor extends React.Component {
  render() {
    const task = NitroSdk.getTask(this.props.match.params.task)
    return (
      <View>
        <MaterialHeader
          leftIcon="back"
          leftAction={this.props.history.goBack}
        />
        <View>
          <Text>id: {task.id}</Text>
          <Text>{task.name}</Text>
        </View>
      </View>
    )
  }
}
