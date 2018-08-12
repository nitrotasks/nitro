import React from 'react'
import { Text, View } from 'react-native'
import { logHistory } from '../../nitro.sdk'

export class Logs extends React.Component {
  render() {
    return (
      <View>
        {logHistory().map((text, key) => {
          return (
            <View key={key}>
              <Text>
                {text[1]}: {text[2]}
              </Text>
            </View>
          )
        })}
      </View>
    )
  }
}
