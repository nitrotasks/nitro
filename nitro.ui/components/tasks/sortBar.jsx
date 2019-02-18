import React from 'react'
import { vars } from '../../styles.js'
import { View, Text, StyleSheet } from 'react-native'

const sorts = [
  {
    id: 'magic',
    name: 'Magic'
  },
  {
    id: 'deadline',
    name: 'Deadline'
  },
  {
    id: 'priority',
    name: 'Priority'
  },
  {
    id: 'alphabetical',
    name: 'Alphabetical'
  }
]
export class SortBar extends React.Component {
  triggerSort(algorithm) {
    return () => console.log('selected', algorithm)
  }
  triggerIgnoreHeaders(state) {
    return () => console.log('selected', state)
  }
  render() {
    // This should be sourced from the list.
    const selected = 'magic'
    return (
      <View style={styles.wrapper}>
        <View style={styles.sortsWrapper}>
          {sorts.map(sort => {
            const selectedArray = selected.split('-')
            const isSelected = selectedArray[0] === sort.id
            const isIgnoreHeaders = selectedArray[1] === 'ignoreheaders'
            return (
              <View
                style={
                  isSelected
                    ? [styles.sortWrapper, styles.sortWrapperSelected]
                    : styles.sortWrapper
                }
                key={sort.id}
                accessible={true}
                onClick={this.triggerSort(sort.id)}
              >
                <Text
                  style={
                    isSelected
                      ? [styles.sortText, styles.sortTextSelected]
                      : styles.sortText
                  }
                >
                  {sort.name}
                </Text>
              </View>
            )
          })}
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: vars.padding / 2,
    paddingRight: vars.padding / 2,
    paddingBottom: vars.padding / 2
  },
  sortsWrapper: {
    flexDirection: 'row',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden'
  },
  sortWrapper: {
    paddingTop: vars.padding * 0.375,
    paddingBottom: vars.padding * 0.375,
    paddingLeft: vars.padding / 2,
    paddingRight: vars.padding / 2,
    boxShadow: '1px 0 0 #ddd'
  },
  sortWrapperSelected: {
    backgroundColor: vars.dragColor
  },
  sortText: {
    fontFamily: vars.fontFamily,
    fontWeight: '600',
    fontSize: 13,
    color: '#444',
    userSelect: 'none'
  },
  sortTextSelected: {
    color: '#000'
  }
})
