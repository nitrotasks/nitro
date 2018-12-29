import React from 'react'
import { object } from 'prop-types'
import { View, Image, Text, StyleSheet } from 'react-native'
import { withRouter } from 'react-router'

import { NitroSdk } from '../../../nitro.sdk'
import { ContextMenuService } from '../../services/contextMenuService.js'
import { ModalService } from '../../services/modalService.js'
import { SidebarService } from '../../services/sidebarService.js'
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
          <TouchableOpacity
            className="hover-5"
            style={styles.addWrapper}
            onClick={this.createList}
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
            className="hover-5"
            style={styles.settingsWrapper}
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
  }
})
