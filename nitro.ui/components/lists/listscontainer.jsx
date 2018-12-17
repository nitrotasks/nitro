import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet } from 'react-native'

import { NitroSdk } from '../../../nitro.sdk'
import { vars } from '../../styles'
import { UiService } from '../../services/uiService.js'
import { DroppableScrollableWrapper } from '../reusable/droppableScrollableWrapper.jsx'
import { ListItem } from './listitem.jsx'

export class ListsContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      lists: NitroSdk.getLists()
    }
    UiService.state.currentListsOrder = this.state.lists.map(l => l.id)
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
    requestAnimationFrame(() => {
      const lists = NitroSdk.getLists()
      UiService.state.currentListsOrder = lists.map(l => l.id)
      this.setState({
        lists: lists
      })
    })
  }
  createList = () => {
    const list = NitroSdk.addList({ name: 'Untitled List' })
    this.props.history.push('/' + list.id)
  }
  render() {
    let index = -1
    return (
      <DroppableScrollableWrapper
        id="listsDroppable"
        linked={true}
        className="desktop-97"
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
          <ListItem
            key="add"
            id="add"
            name="New List"
            index={index + 1}
            onClick={this.createList}
          />
        </View>
      </DroppableScrollableWrapper>
    )
  }
}

const padding = vars.padding / 2
const styles = StyleSheet.create({
  listWrapper: {
    paddingLeft: padding,
    paddingRight: padding,
    paddingBottom: padding
  }
})
