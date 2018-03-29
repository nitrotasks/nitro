import React from 'react'
import { Image, View, Text, StyleSheet } from 'react-native'
import { Link } from '../link.jsx'

import { vars } from '../../styles'

export class ListItem extends React.Component {
  render() {
    return (
      <Link to={`/${this.props.id}`}>
        <View style={styles.wrapper}>
          <View style={styles.nameWrapper}>
            <Text style={styles.name}>{this.props.name}</Text>
          </View>
          <View style={styles.countWrapper}>
            <Text style={styles.count}>{this.props.count}</Text>
          </View>
        </View>
      </Link>
    )
  }
}

const height = vars.padding * 2.75
const styles = StyleSheet.create({
  wrapper: {
    height: height,
    paddingLeft: vars.padding / 2,
    paddingRight: vars.padding / 2,
    marginBottom: vars.padding * 0.25,
    flex: 1,
    flexDirection: 'row',
  },
  nameWrapper: {
    flex: 1,
  },
  name: {
    fontSize: vars.padding * 1.125,
    fontWeight: '600',
    lineHeight: height,
    color: vars.navTextColor,
  },
  countWrapper: {
    paddingLeft: vars.padding / 4,
    paddingRight: vars.padding / 4,
  },
  count: {
    fontSize: vars.padding,
    fontWeight: '600',
    lineHeight: height,
    color: vars.navTextColorMuted,
  }
})