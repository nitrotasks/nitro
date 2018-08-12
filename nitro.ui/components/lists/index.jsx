import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet } from 'react-native'

import { NitroSdk } from '../../../nitro.sdk'
import { vars } from '../../styles'
import { ContextMenuService } from '../../services/contextMenuService.js'
import { ListItem } from './listitem.jsx'
import { LinkedScroll } from '../reusable/linkedScroll.jsx'
import { ListHeader } from './listheader.jsx'

export class Lists extends React.Component {
  state = {
    lists: NitroSdk.getLists()
  }
  componentWillMount() {
    NitroSdk.bind('update', this.update)
  }
  componentWillUnmount() {
    NitroSdk.unbind('update', this.update)
  }
  update = () => {
    // we listen to all updates, so the counts also get updated
    this.setState({
      lists: NitroSdk.getLists()
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
    return (
      <View style={styles.wrapper}>
        <ListHeader title="Today" />
        <LinkedScroll>
          <View style={styles.listWrapper}>
            {this.state.lists.map(list => {
              return (
                <ListItem
                  key={list.id}
                  id={list.id}
                  name={list.name}
                  count={list.count}
                />
              )
            })}
            <ListItem
              key="add"
              id="add"
              name="New List"
              onClick={this.createList}
            />
            <ListItem key="logs" id="logs" name="System Logs" />
          </View>
        </LinkedScroll>
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
