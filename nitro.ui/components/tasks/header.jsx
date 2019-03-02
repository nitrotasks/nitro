import React from 'react'
import { string, func } from 'prop-types'
import {
  View,
  Image,
  TextInput,
  StyleSheet,
  findNodeHandle
} from 'react-native'

import { NitroSdk } from '../../../nitro.sdk'

import { vars } from '../../styles.js'
import { headerMenu } from './headerMenu.js'
import menuIcon from '../../../assets/icons/material/task-more.svg'
import sortIcon from '../../../assets/icons/material/sort.svg'
import sortSelectedIcon from '../../../assets/icons/material/sort-selected.svg'

export class Header extends React.PureComponent {
  static propTypes = {
    listId: string,
    onIntersect: func
  }
  static getDerivedStateFromProps(props, state) {
    return props.listId !== state.previousId
      ? Header.generateState(props)
      : null
  }
  static generateState(props) {
    const list = NitroSdk.getList(props.listId)
    if (list !== null) {
      return {
        previousId: props.listId,
        exists: true,
        name: list.name,
        mutable: list.mutable,
        sort: list.sort !== null
      }
    } else {
      return {
        sort: false,
        previousId: props.listId,
        exists: false,
        name: 'Not Found'
      }
    }
  }
  state = {
    ...this.constructor.generateState(this.props),
    textInputFocus: false
  }
  observer = new IntersectionObserver(this.props.onIntersect, {
    root: null,
    rootMargin: '-65px',
    threshold: 0
  })
  wrapper = React.createRef()

  componentDidMount() {
    const handle = findNodeHandle(this.wrapper.current)
    if (handle !== null) {
      this.observer.observe(handle)
    }
  }
  componentWillUnmount() {
    this.observer.disconnect()
  }

  triggerMenu = e => {
    const x = e.nativeEvent.pageX
    const y = e.nativeEvent.pageY
    headerMenu(this.props.listId, x, y, 'top', 'right')
  }
  triggerSort = () => {
    const { listId } = this.props
    const list = NitroSdk.getList(listId)
    let newSort = null
    if (list.sort === null) {
      newSort = 'magic' // maybe we should let users configure this
    }
    NitroSdk.updateList(listId, { sort: newSort })
    this.setState({ sort: newSort !== null })
  }
  triggerChange = e => {
    this.setState({
      name: e.currentTarget.value
    })
  }
  triggerFocus = () => {
    this.setState({
      textInputFocus: true
    })
  }
  triggerBlur = () => {
    const name = this.state.name.trim()
    if (name === '') {
      const state = this.constructor.generateState(this.props)
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
      const elem = e.currentTarget
      this.setState(this.constructor.generateState(this.props), () =>
        elem.blur()
      )
      // ENTER
    } else if (e.keyCode === 13) {
      e.currentTarget.blur()
    }
  }
  render() {
    const { name, mutable, exists } = this.state
    if (!this.state.textInputFocus) {
      document.title = name + ' - Nitro'
    }
    if (!exists) {
      return null
    }
    const renameNotAllowed = mutable.indexOf('no-rename') !== -1
    const orderNotAllowed = mutable.indexOf('no-order') !== -1
    const listHeaderStyles = this.state.textInputFocus
      ? [styles.listHeader, styles.focusedListHeader]
      : styles.listHeader
    return (
      <View style={styles.listHeaderWrapper} ref={this.wrapper}>
        <TextInput
          className={renameNotAllowed ? null : 'hover-5'}
          style={listHeaderStyles}
          value={this.state.name}
          onChange={this.triggerChange}
          onFocus={this.triggerFocus}
          onBlur={this.triggerBlur}
          onKeyUp={this.triggerKeyUp}
          disabled={renameNotAllowed}
        />
        {orderNotAllowed ? null : (
          <View onClick={this.triggerSort} style={styles.sortIconWrapper}>
            {this.state.sort ? (
              <Image source={sortSelectedIcon} style={styles.menuIcon} />
            ) : (
              <Image source={sortIcon} style={styles.menuIcon} />
            )}
          </View>
        )}
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
    paddingTop: vars.padding * 3,
    paddingLeft: vars.padding / 2,
    paddingRight: vars.padding * 0.75,
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
    paddingLeft: vars.padding * 0.125,
    paddingRight: vars.padding * 0.25
  },
  sortIconWrapper: {
    paddingLeft: vars.padding * 0.75,
    paddingRight: vars.padding * 0.125
  },
  menuIcon: {
    height: 24,
    width: 24
  }
})
