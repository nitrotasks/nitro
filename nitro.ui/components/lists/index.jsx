import React from 'react'
import { View, StyleSheet } from 'react-native'

import { NitroSdk } from '../../../nitro.sdk'
import { vars } from '../../styles'
import { ContextMenuService } from '../../services/contextMenuService.js'
import { ListItem } from './listitem.jsx'
import { DroppableScrollableWrapper } from '../reusable/droppableScrollableWrapper.jsx'
import { ListHeader } from './listheader.jsx'
import { ListsContainer } from './listscontainer.jsx'
import { SearchContainer } from './searchcontainer.jsx'

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
    ContextMenuService.create(e.clientX, e.clientY, 'top', 'right', items)
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
    let index = -1
    return (
      <View style={styles.wrapper}>
        <ListHeader onSearch={this.triggerSearch} />
        {this.state.searchResults === null ? 
          <ListsContainer /> : 
          <SearchContainer results={this.state.searchResults} />
        }
      </View>
    )
  }
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  }
})
