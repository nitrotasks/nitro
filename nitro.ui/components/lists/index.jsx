import React, { useState } from 'react'
import { object } from 'prop-types'
import { View, Image, Text, StyleSheet, findNodeHandle } from 'react-native'
import { withRouter } from 'react-router'

import { iOS } from '../../helpers/ios.js'
import { NitroSdk } from '../../../nitro.sdk'
import { ContextMenuService } from '../../services/contextMenuService.js'
import { ModalService } from '../../services/modalService.js'
import { SidebarService } from '../../services/sidebarService.js'
import { UiService } from '../../services/uiService.js'
import { ListHeader } from './listheader.jsx'
import { ListsContainer } from './listscontainer.jsx'
import { SearchContainer } from './searchcontainer.jsx'
import { TouchableOpacity } from '../reusable/touchableOpacity.jsx'

import { vars } from '../../styles'
import addIcon from '../../../assets/icons/feather/add.svg'
import settingsIcon from '../../../assets/icons/feather/settings.svg'

class ListsWithoutRouter extends React.Component {
  static propTypes = {
    history: object
  }

  bar = React.createRef()

  state = {
    searchResults: null,
    value: '',
    addHover: false,
    settingsHover: false
  }

  componentDidMount() {
    SidebarService.bind('hide-search-results', this.hideSearchResults)
    if (iOS.detect()) {
      findNodeHandle(this.bar.current).addEventListener(
        'touchmove',
        this.preventScroll
      )
    }
  }

  componentWillUnmount() {
    SidebarService.unbind('hide-search-results', this.hideSearchResults)
  }

  hideSearchResults = () => {
    this.setState({
      searchResults: null,
      value: ''
    })
  }

  triggerMenu = e => {
    const items = [
      {
        title: 'Create Tutorial List',
        action: () => {
          const listId = NitroSdk.addTutorialList(
            window.innerWidth > 850 ? 'desktop' : 'mobile'
          )
          this.props.history.push(`/${listId}`)
        }
      },
      {
        title: 'Sign Out',
        action: () => NitroSdk.signOut(null, true)
      }
    ]
    if (window.innerWidth > 850) {
      items.unshift({
        title: 'Keyboard Shortcuts',
        action: ModalService.showShortcuts
      })
    }
    ContextMenuService.create(e.clientX, e.clientY, 'bottom', 'right', items)
  }

  triggerSearch = e => {
    const query = e.currentTarget.value.trim()
    if (query === '') {
      this.setState({
        searchResults: null,
        value: e.currentTarget.value
      })
    } else {
      const results = NitroSdk.search(query)
      this.setState({
        searchResults: results,
        value: e.currentTarget.value
      })
    }
  }

  createList = () => {
    const { history } = this.props
    const list = NitroSdk.addList({ name: 'Untitled List' })
    history.push(`/${list.id}`)
    UiService.setCardPosition('map')
  }

  preventScroll = e => {
    e.preventDefault()
  }

  triggerAddEnter = () => {
    this.setState({
      addHover: true
    })
  }

  triggerAddLeave = () => {
    this.setState({
      addHover: false
    })
  }

  triggerSettingsEnter = () => {
    this.setState({
      settingsHover: true
    })
  }

  triggerSettingsLeave = () => {
    this.setState({
      settingsHover: false
    })
  }

  render() {
    const { addHover, settingsHover, searchResults, value } = this.state
    return (
      <View style={styles.wrapper}>
        <ListHeader onSearch={this.triggerSearch} value={value} />
        {searchResults === null ? (
          <ListsContainer />
        ) : (
          <SearchContainer results={searchResults} />
        )}
        <View style={styles.bar} ref={this.bar}>
          <TouchableOpacity
            onClick={this.createList}
            onMouseEnter={this.triggerAddEnter}
            onMouseLeave={this.triggerAddLeave}
            style={
              addHover
                ? [styles.addWrapper, styles.buttonHover]
                : styles.addWrapper
            }
          >
            <Image
              source={addIcon}
              resizeMode="contain"
              style={styles.addIcon}
            />
            <Text style={styles.addText}>New List</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onClick={this.triggerMenu}
            onMouseEnter={this.triggerSettingsEnter}
            onMouseLeave={this.triggerSettingsLeave}
            style={
              settingsHover
                ? [styles.settingsWrapper, styles.buttonHover]
                : styles.settingsWrapper
            }
          >
            <Image
              source={settingsIcon}
              resizeMode="contain"
              style={styles.settingsIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
export const Lists = withRouter(ListsWithoutRouter)

const padding = vars.padding / 2
const smallPadding = vars.padding / 4
const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  bar: {
    touchAction: 'none',
    paddingTop: padding,
    paddingLeft: padding,
    paddingRight: padding,
    paddingBottom: padding,
    display: 'flex',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: '#e6e6e6'
  },
  addWrapper: {
    flexDirection: 'row',
    paddingTop: smallPadding,
    paddingLeft: smallPadding,
    paddingRight: smallPadding,
    paddingBottom: smallPadding
  },
  addIcon: {
    height: 24,
    width: 24,
    opacity: 0.8
  },
  addText: {
    fontFamily: vars.fontFamily,
    paddingLeft: smallPadding,
    paddingRight: padding,
    lineHeight: 24,
    fontWeight: '600',
    color: vars.navTextColor
  },
  settingsWrapper: {
    paddingTop: smallPadding,
    paddingBottom: smallPadding,
    paddingLeft: padding,
    paddingRight: padding,
    marginLeft: 'auto'
  },
  settingsIcon: {
    height: 24,
    width: 18,
    opacity: 0.6
  },
  buttonHover: {
    borderRadius: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.035)'
  }
})
