import React from 'react'
import { View, Image, StyleSheet } from 'react-native'

import { NitroSdk } from '../../../nitro.sdk'
import { ContextMenuService } from '../../services/contextMenuService.js'
import { ListHeader } from './listheader.jsx'
import { ListsContainer } from './listscontainer.jsx'
import { SearchContainer } from './searchcontainer.jsx'
import { TouchableOpacity } from '../reusable/touchableOpacity.jsx'

import { vars } from '../../styles'
import settingsIcon from '../../../assets/icons/material/settings.svg'

export class Lists extends React.Component {
  state = {
    searchResults: null
  }
  triggerMenu = e => {
    const items = [
      {
        title: 'Sign Out',
        action: NitroSdk.signOut
      }
    ]
    ContextMenuService.create(e.clientX, e.clientY, 'bottom', 'left', items)
  }
  triggerSearch = e => {
    const query = e.currentTarget.value.trim()
    if (query === '') {
      this.setState({
        searchResults: null
      })
    } else {
      const results = NitroSdk.search(query)
      this.setState({
        searchResults: results
      })
    }
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <ListHeader onSearch={this.triggerSearch} />
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
