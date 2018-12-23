import React from 'react'
import { View, StyleSheet, findNodeHandle } from 'react-native'
import { vars } from '../../styles'

import { SidebarService } from '../../services/sidebarService.js'
import { SearchItem } from './searchitem.jsx'
import { DroppableScrollableWrapper } from '../reusable/droppableScrollableWrapper.jsx'

export class SearchContainer extends React.Component {
  wrapper = React.createRef()
  componentDidMount() {
    SidebarService.bind('focus-search-item-first', this.triggerFocusFirst)
  }
  componentWillUnmount() {
    SidebarService.unbind('focus-search-item-first', this.triggerFocusFirst)
  }
  triggerFocusFirst = () => {
    const wrapperNode = findNodeHandle(this.wrapper.current)
    if (wrapperNode.children[0] !== undefined) {
      wrapperNode.children[0].focus()
    }
  }
  render() {
    return (
      <DroppableScrollableWrapper
        id="searchDroppable"
        linked={true}
        className="desktop-97"
      >
        <View style={styles.wrapper} ref={this.wrapper}>
          {this.props.results.map(i => (
            <SearchItem
              key={i.id}
              icon={i.icon}
              url={i.url}
              name={i.name}
              subtitle={i.subtitle}
            />
          ))}
        </View>
      </DroppableScrollableWrapper>
    )
  }
}

const padding = vars.padding / 2
const styles = StyleSheet.create({
  wrapper: {
    paddingTop: padding,
    paddingLeft: padding,
    paddingRight: padding,
    paddingBottom: padding
  }
})
