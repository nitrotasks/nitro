import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, TextInput, StyleSheet } from 'react-native'

import { NitroSdk } from '../../../nitro.sdk'

import { vars } from '../../styles'

export class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.generateState(this.props)
  }
  generateState(props) {
    const list = NitroSdk.getList(props.listId)
    return {
      name: list.name
    }
  }
  triggerChange = e => {
    this.setState({
      name: e.currentTarget.value
    })
  }
  triggerFocus = e => {
    this.setState({
      textInputFocus: true
    })
  }
  triggerBlur = e => {
    const name = this.state.name.trim()
    if (name === '') {
      const state = this.generateState(this.props)
      state.textInputFocus = false
      this.setState(state)
    } else {
      NitroSdk.updateList(this.props.listId, {
        name: this.state.name
      })
      this.setState({
        textInputFocus: false
      })
    }
  }
  triggerKeyUp = e => {
    // ESC
    if (e.keyCode === 27) {
      this.setState(this.generateState(this.props))
      e.currentTarget.blur()
      // ENTER
    } else if (e.keyCode === 13) {
      e.currentTarget.blur()
    }
  }
  render() {
    const listHeaderStyles = this.state.textInputFocus
      ? StyleSheet.flatten([styles.listHeader, styles.focusedListHeader])
      : styles.listHeader
    return (
      <View style={styles.listHeaderWrapper}>
        <TextInput
          style={listHeaderStyles}
          value={this.state.name}
          onChange={this.triggerChange}
          onFocus={this.triggerFocus}
          onBlur={this.triggerBlur}
          onKeyUp={this.triggerKeyUp}
        />
      </View>
    )
  }
}

Header.propTypes = {
  listId: PropTypes.string
}

const styles = StyleSheet.create({
  listHeaderWrapper: {
    paddingTop: vars.padding,
    paddingLeft: vars.padding / 2,
    paddingRight: vars.padding / 2,
    paddingBottom: vars.padding / 4
  },
  listHeader: {
    padding: vars.padding / 2,
    paddingBottom: vars.padding / 4,
    paddingTop: vars.padding / 4,
    fontSize: 32,
    fontWeight: '900',
    outline: '0',
    borderRadius: 3,
    lineHeight: 1,
    textOverflow: 'ellipsis'
  },
  focusedListHeader: {
    backgroundColor: 'rgba(0, 0, 0, 0.08)'
  }
})
