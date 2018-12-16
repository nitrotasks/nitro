import React from 'react'
import { View, StyleSheet } from 'react-native'
import { vars } from '../../styles'
import { SearchItem } from './searchitem.jsx'
import { DroppableScrollableWrapper } from '../reusable/droppableScrollableWrapper.jsx'

export class SearchContainer extends React.Component {
  render() {
    return (
      <DroppableScrollableWrapper
        id="searchDroppable"
        linked={true}
        className="desktop-97"
      >
        <View style={styles.wrapper}>
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
    paddingLeft: padding,
    paddingRight: padding,
    paddingBottom: padding
  }
})
