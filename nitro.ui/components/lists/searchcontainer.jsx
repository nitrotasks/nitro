import React from 'react'
import { View, StyleSheet } from 'react-native'
import { vars } from '../../styles'
import { SearchItem } from './searchitem.jsx'

export class SearchContainer extends React.Component {
  render() {
    return (
      <View style={styles.wrapper}>
        {this.props.results.map(i => (
          <SearchItem
            key={i.id}
            icon={i.icon}
            url={i.url}
            name={i.name}
            subtitle={i.subtitle}
          />
        ))}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    paddingLeft: vars.padding * 0.75,
    paddingRight: vars.padding * 0.75,
    paddingBottom: vars.padding * 0.5
  }
})
