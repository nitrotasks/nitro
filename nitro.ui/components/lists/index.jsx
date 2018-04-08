import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet } from 'react-native'

import { NitroSdk } from '../../../nitro.sdk'
import { vars, exitStyles } from '../../styles'
import { MaterialHeader } from '../materialHeader.jsx'
import { ListItem } from './listitem.jsx'

export class Lists extends React.Component {
  state = {
    lists: NitroSdk.getLists()
  }
  componentWillMount() {
    NitroSdk.bind('update', this.update)
  }
  componentWillUnmount() {
    NitroSdk.unbind('update', this.update)
  }
  update = () => {
    // we listen to all updates, so the counts also get updated
    this.setState({
      lists: NitroSdk.getLists()
    })
  }
  render() {
    const wrapperStyles =
      this.props.transitionState === 'exiting'
        ? [styles.wrapper, styles.wrapperExiting]
        : styles.wrapper
    return (
      <View style={wrapperStyles}>
        <MaterialHeader leftIcon="logo" h1="NITRO" h1Weight="900" />
        <View style={styles.listWrapper}>
          {this.state.lists.map(list => {
            return (
              <ListItem
                key={list.id}
                id={list.id}
                name={list.name}
                count={list.count}
              />
            )
          })}
        </View>
      </View>
    )
  }
}
Lists.propTypes = {
  transitionState: PropTypes.string
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: vars.backColor
  },
  wrapperExiting: {
    ...exitStyles,
    zIndex: -1
  },
  listWrapper: {
    padding: vars.padding / 2
  }
})
