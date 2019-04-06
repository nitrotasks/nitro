import React from 'react'
import { object } from 'prop-types'
import { View, StyleSheet } from 'react-native'
import { withRouter } from 'react-router'

import { NitroSdk } from '../../../nitro.sdk'
import { vars } from '../../styles'
import { ShortcutsService } from '../../services/shortcutsService.js'
import { UiService } from '../../services/uiService.js'
import { DroppableScrollableWrapper } from '../reusable/droppableScrollableWrapper.jsx'
import { ListItem } from './listitem.jsx'

const GLOBAL_UP_HOTKEY = 'alt+up'
const GLOBAL_DOWN_HOTKEY = 'alt+down'

class ListsContainerWithoutRouter extends React.Component {
  static propTypes = {
    history: object
  }
  constructor(props) {
    super(props)
    this.state = {
      lists: NitroSdk.getLists()
    }
    // bit of a shit hack for drag and drop
    UiService.state.currentListsOrder = this.state.lists.map(l => l.id)
  }
  componentWillMount() {
    NitroSdk.bind('update', this.update)
    NitroSdk.bind('lists-order', this.update)
    ShortcutsService.bind(GLOBAL_UP_HOTKEY, this.triggerHotkey)
    ShortcutsService.bind(GLOBAL_DOWN_HOTKEY, this.triggerHotkey)
  }
  componentWillUnmount() {
    NitroSdk.unbind('update', this.update)
    NitroSdk.unbind('lists-order', this.update)
    ShortcutsService.unbind(GLOBAL_UP_HOTKEY, this.triggerHotkey)
    ShortcutsService.unbind(GLOBAL_DOWN_HOTKEY, this.triggerHotkey)
  }
  triggerHotkey = (event, key) => {
    let direction = 0
    if (key === GLOBAL_DOWN_HOTKEY) {
      direction = 1
    } else if (key === GLOBAL_UP_HOTKEY) {
      direction = -1
    } else {
      return
    }
    const { history } = this.props
    const nextList =
      UiService.state.currentListsOrder[
        UiService.state.currentListsOrder.indexOf(UiService.state.currentList) +
          direction
      ]
    if (nextList !== undefined) {
      history.push(`/${nextList}`)
    }
  }
  update = () => {
    // we listen to all updates, so the counts also get updated
    requestAnimationFrame(() => {
      const lists = NitroSdk.getLists()
      UiService.state.currentListsOrder = lists.map(l => l.id)
      this.setState({
        lists: lists
      })
    })
  }
  render() {
    let index = -1
    return (
      <DroppableScrollableWrapper
        id="listsDroppable"
        linked={true}
        className="desktop-97"
        overflowType="auto"
      >
        <View style={styles.listWrapper}>
          {this.state.lists.map(list => {
            index++ // this is a bit shit
            return (
              <ListItem
                key={list.id}
                id={list.id}
                index={index}
                name={list.name}
                count={list.count}
              />
            )
          })}
        </View>
      </DroppableScrollableWrapper>
    )
  }
}
export const ListsContainer = withRouter(ListsContainerWithoutRouter)

const padding = vars.padding / 2
const styles = StyleSheet.create({
  listWrapper: {
    paddingLeft: padding,
    paddingRight: padding,
    paddingBottom: padding
  }
})
