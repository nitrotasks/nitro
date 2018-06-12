import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { logHistory } from '../../nitro.sdk'

import { vars } from '../styles.js'
import { MaterialHeader } from './materialHeader.jsx'

export class Logs extends React.Component {
  render() {
    return (
      <View style={styles.wrapper}>
        <MaterialHeader
          fixed={true}
          leftIcon="back"
          leftAction={this.props.history.goBack}
          h1Visible={true}
          h1="Logs"
        />
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
const styles = StyleSheet.create({
  wrapper: {
    paddingTop: vars.materialHeaderHeight
  }
})
