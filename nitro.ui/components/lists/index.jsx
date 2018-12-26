import React from 'react'
import { View, Image, StyleSheet } from 'react-native'

import { NitroSdk } from '../../../nitro.sdk'
import { ContextMenuService } from '../../services/contextMenuService.js'
import { ModalService } from '../../services/modalService.js'
import { SidebarService } from '../../services/sidebarService.js'
import { ListHeader } from './listheader.jsx'
import { ListsContainer } from './listscontainer.jsx'
import { SearchContainer } from './searchcontainer.jsx'
import { TouchableOpacity } from '../reusable/touchableOpacity.jsx'

import { vars } from '../../styles'
import settingsIcon from '../../../assets/icons/material/settings.svg'

export class Lists extends React.Component {
  state = {
    searchResults: null,
    value: ''
  }
  componentDidMount() {
    SidebarService.bind('hide-search-results', this.hideSearchResults)
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
        title: 'Keyboard Shortcuts',
        action: ModalService.showShortcuts
      },
      {
        title: 'Sign Out',
        action: () => NitroSdk.signOut(null, true)
      }
    ]
    ContextMenuService.create(e.clientX, e.clientY, 'bottom', 'left', items)
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

  render() {
    return (
      <View style={styles.wrapper}>
        <ListHeader onSearch={this.triggerSearch} value={this.state.value} />
        {this.state.searchResults === null ? (
          <ListsContainer />
        ) : (
          <SearchContainer results={this.state.searchResults} />
        )}
        <View style={styles.bar}>
          <TouchableOpacity onClick={this.triggerMenu}>
            <Image
              source={settingsIcon}
              resizeMode="contain"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
const padding = vars.padding / 2
const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  bar: {
    paddingTop: padding,
    paddingLeft: padding,
    paddingRight: padding,
    paddingBottom: padding
  },
  icon: {
    height: 24,
    width: 24,
    opacity: 0.6
  }
})
