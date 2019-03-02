import React from 'react'
import { vars } from '../../styles.js'
import { View, Text, Image, StyleSheet } from 'react-native'

import { NitroSdk } from '../../../nitro.sdk'
import checkIcon from '../../../assets/icons/material/check.svg'
import closeIcon from '../../../assets/icons/material/close.svg'

const sorts = [
  {
    id: 'magic',
    name: 'Magic'
  },
  {
    id: 'deadline',
    name: 'Date'
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
  state = { sort: null }
  static getDerivedStateFromProps(props) {
    const { listId } = props
    const list = NitroSdk.getList(listId)
    return {
      sort: list.sort
    }
  }
  componentDidMount() {
    NitroSdk.bind('update', this.triggerUpdate)
  }
  componentWillUnmount() {
    NitroSdk.unbind('update', this.triggerUpdate)
  }
  triggerUpdate = operation => {
    // This is a bit redundant, but will need a bit of a refactor to do it properly
    if (operation === 'lists') {
      const { listId } = this.props
      const list = NitroSdk.getList(listId)
      if (list.sort !== this.state.sort) {
        this.setState({
          sort: list.sort
        })
      }
    }
  }

  triggerSort(algorithm) {
    return () => {
      const { listId } = this.props
      const selected = this.state.sort
      const selectedArray = (selected || '').split('-')
      const newSort = [algorithm]
      if (selectedArray[1]) {
        newSort.push(selectedArray[1])
      }
      NitroSdk.updateList(listId, {
        sort: newSort.join('-')
      })
    }
  }
  triggerIgnoreHeaders(state) {
    return () => {
      const { listId } = this.props
      const selected = this.state.sort
      const selectedArray = (selected || '').split('-')
      const newSelected = state
        ? `${selectedArray[0]}-ignoreheaders`
        : selectedArray[0]
      NitroSdk.updateList(listId, { sort: newSelected })
    }
  }
  render() {
    // don't show anything if no sort is selected
    const selected = this.state.sort
    if (selected === null) return null
    const selectedArray = (selected || '').split('-')
    const isIgnoreHeaders = selectedArray[1] === 'ignoreheaders'
    return (
      <View style={styles.wrapper} className="sort-bar">
        <View style={styles.sortsWrapper}>
          {sorts.map(sort => {
            const isSelected = selectedArray[0] === sort.id
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
        <View style={styles.headersWrapper}>
          <View style={styles.sortsWrapper}>
            <View
              style={
                !isIgnoreHeaders
                  ? [styles.sortWrapperSm, styles.sortWrapperSelected]
                  : styles.sortWrapperSm
              }
              accessible={true}
              onClick={this.triggerIgnoreHeaders(false)}
            >
              <Image
                accessibilityLabel="Include Headers"
                title="Include Headers"
                resizeMode="contain"
                source={checkIcon}
                style={styles.image}
              />
            </View>
            <View
              style={
                isIgnoreHeaders
                  ? [styles.sortWrapperSm, styles.sortWrapperSelected]
                  : styles.sortWrapperSm
              }
              accessible={true}
              onClick={this.triggerIgnoreHeaders(true)}
            >
              <Image
                accessibilityLabel="Exclude Headers"
                title="Exclude Headers"
                resizeMode="contain"
                source={closeIcon}
                style={styles.image}
              />
            </View>
          </View>
          <View style={styles.inlineTextWrapper}>
            <Text style={styles.inlineText}>Include Headers</Text>
          </View>
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    paddingLeft: vars.padding - 2,
    paddingRight: vars.padding - 2
  },
  sortsWrapper: {
    flexDirection: 'row',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: vars.padding / 2,
    marginRight: vars.padding / 2
  },
  sortWrapper: {
    paddingTop: vars.padding * 0.375,
    paddingBottom: vars.padding * 0.375,
    paddingLeft: vars.padding / 2,
    paddingRight: vars.padding / 2,
    boxShadow: '1px 0 0 #ddd'
  },
  sortWrapperSm: {
    paddingTop: vars.padding * 0.3125,
    paddingBottom: vars.padding * 0.3125,
    paddingLeft: vars.padding * 0.375,
    paddingRight: vars.padding * 0.375,
    boxShadow: '1px 0 0 #ddd'
  },
  sortWrapperSelected: {
    backgroundColor: vars.dragColor
  },
  headersWrapper: {
    flexDirection: 'row'
  },
  inlineTextWrapper: {
    paddingTop: vars.padding * 0.375 + 1,
    paddingBottom: vars.padding * 0.375 + 1,
    paddingRight: vars.padding / 4
  },
  inlineText: {
    fontFamily: vars.fontFamily,
    fontSize: 13,
    lineHeight: 16,
    color: '#333',
    userSelect: 'none'
  },
  sortText: {
    fontFamily: vars.fontFamily,
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 16,
    color: '#444',
    userSelect: 'none'
  },
  sortTextSelected: {
    color: '#000'
  },
  image: {
    width: 18,
    height: 18
  }
})
