import React from 'react'
import { View, Text } from 'react-native'

export class SearchContainer extends React.Component {
  render() {
    return (
      <View>
        {this.props.results.map(i => {
          return <View key={i.id}><Text>{i.type} {i.name}</Text></View>
        })}
      </View>
    )
  }
}