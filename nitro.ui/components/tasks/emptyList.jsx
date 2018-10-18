import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, Image, StyleSheet } from 'react-native'

import { vars } from '../../styles.js'
import emptyIcon from '../../../assets/icons/material/empty.svg'

export class EmptyList extends React.Component {
  static propTypes = {
    listId: PropTypes.string
  }
  render() {
    const { listId } = this.props

    let emptyText = 'There are no tasks in this list'
    if (listId === 'today') {
      emptyText = 'You have no tasks for today'
    } else if (listId === 'next') {
      emptyText = 'You have no tasks upcoming'
    }
    return (
      <View style={styles.empty}>
        <Image
          accessibilityLabel="Today Icon"
          source={emptyIcon}
          resizeMode="contain"
          style={styles.emptyIcon}
        />
        <Text style={styles.emptyText}>{emptyText}</Text>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  empty: {
    marginTop: vars.padding * 2,
    marginBottom: vars.padding * 2
  },
  emptyIcon: {
    height: 50,
    marginBottom: vars.padding
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: vars.fontFamily,
    fontWeight: '600',
    color: '#666'
  }
})
