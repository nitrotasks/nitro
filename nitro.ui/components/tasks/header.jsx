import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  findNodeHandle
} from 'react-native'

import { NitroSdk } from '../../../nitro.sdk'

import { vars } from '../../styles'
import { headerMenu } from './headerMenu.js'
import menuIcon from '../../../assets/icons/material/task-more.svg'

class HeaderWithoutRouter extends React.PureComponent {
  static propTypes = {
    listId: PropTypes.string,
    onIntersect: PropTypes.func
  }
  constructor(props) {
    super(props)
    this.state = this.generateState(this.props)
    this.observer = new IntersectionObserver(this.props.onIntersect, {
      root: null,
      rootMargin: '-65px',
      threshold: 0
    })
    this.wrapper = React.createRef()
  }
  componentDidMount() {
    this.observer.observe(findNodeHandle(this.wrapper.current))
  }
  componentWillUnmount() {
    this.observer.disconnect()
  }
  generateState(props) {
    const list = NitroSdk.getList(props.listId)
    return {
      name: list.name
    }
  }
  triggerMenu = e => {
    const x = e.nativeEvent.pageX
    const y = e.nativeEvent.pageY
    headerMenu(this.props.listId, x, y, 'top', 'right', () => {
      this.props.history.goBack()
    })
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
      if (NitroSdk.getList(this.props.listId).name !== this.state.name) {
        NitroSdk.updateList(this.props.listId, {
          name: this.state.name
        })
      }
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
    const list = NitroSdk.getList(this.props.listId)
    if (list === null) {
      return null
    }
    const mutable = list.mutable
    const renameNotAllowed = mutable.indexOf('no-rename') !== -1
    const listHeaderStyles = this.state.textInputFocus
      ? [styles.listHeader, styles.focusedListHeader]
      : styles.listHeader
    return (
      <View style={styles.listHeaderWrapper} ref={this.wrapper}>
        <TextInput
          style={listHeaderStyles}
          value={this.state.name}
          onChange={this.triggerChange}
          onFocus={this.triggerFocus}
          onBlur={this.triggerBlur}
          onKeyUp={this.triggerKeyUp}
          disabled={renameNotAllowed}
        />
        {renameNotAllowed ? null : (
          <View onClick={this.triggerMenu} style={styles.menuIconWrapper}>
            <Image source={menuIcon} style={styles.menuIcon} />
          </View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  listHeaderWrapper: {
    paddingTop: vars.padding / 2,
    paddingLeft: vars.padding / 2,
    paddingRight: vars.padding / 2,
    paddingBottom: vars.padding / 4,
    flexDirection: 'row',
    alignItems: 'center'
  },
  listHeader: {
    minWidth: 0,
    paddingLeft: vars.padding / 2,
    paddingRight: vars.padding / 2,
    paddingBottom: vars.padding / 2,
    paddingTop: vars.padding / 2,
    fontFamily: vars.fontFamily,
    fontSize: 32,
    fontWeight: '900',
    outline: '0',
    borderRadius: 3,
    lineHeight: 1.15,
    textOverflow: 'ellipsis',
    color: vars.headerColor,
    flex: 1
  },
  focusedListHeader: {
    backgroundColor: 'rgba(0, 0, 0, 0.08)'
  },
  menuIconWrapper: {
    paddingLeft: vars.padding * 0.5,
    paddingRight: vars.padding * 0.5
  },
  menuIcon: {
    height: 24,
    width: 24
  }
})

export const Header = withRouter(HeaderWithoutRouter)
