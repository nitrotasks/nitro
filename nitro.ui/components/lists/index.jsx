import React from 'react'
import { View, StyleSheet } from 'react-native'

import { NitroSdk } from '../../../nitro.sdk'
import { vars } from '../../styles'
import { ContextMenuService } from '../../services/contextMenuService.js'
import { UiService } from '../../services/uiService.js'
import { ListItem } from './listitem.jsx'
import { DroppableScrollableWrapper } from '../reusable/droppableScrollableWrapper.jsx'
import { ListHeader } from './listheader.jsx'

export class Lists extends React.Component {
  state = {
    lists: NitroSdk.getLists()
  }
  componentWillMount() {
    NitroSdk.bind('update', this.update)
    NitroSdk.bind('lists-order', this.update)
  }
  componentWillUnmount() {
    NitroSdk.unbind('update', this.update)
    NitroSdk.unbind('lists-order', this.update)
  }
  update = () => {
    // we listen to all updates, so the counts also get updated
    const lists = NitroSdk.getLists()
    UiService.state.currentListsOrder = lists.map(l => l.id)
    this.setState({
      lists: lists
    })
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
  createList = () => {
    const list = NitroSdk.addList({ name: 'Untitled List' })
    this.props.history.push('/' + list.id)
  }
  render() {
    let index = -1
    return (
      <View style={styles.wrapper}>
        <ListHeader />
        <DroppableScrollableWrapper id="listsDroppable" linked={true}>
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
            <ListItem
              key="add"
              id="add"
              name="New List"
              index={index + 1}
              onClick={this.createList}
            />
            <ListItem
              index={index + 2}
              key="logs"
              id="logs"
              name="System Logs"
            />
          </View>
        </DroppableScrollableWrapper>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  listWrapper: {
    paddingTop: vars.padding / 2,
    paddingBottom: vars.padding / 2
  }
})
