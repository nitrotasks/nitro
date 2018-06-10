import React from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import { Route } from 'react-router'

import { NitroSdk } from '../../../nitro.sdk'
import { vars, exitStyles } from '../../styles.js'
import { TasksExpandedService } from '../../services/tasksExpandedService.js'
import { MaterialHeader } from '../materialHeader.jsx'
import { Header } from './header.jsx'
import { TasksInput } from './tasksInput.jsx'
import { TasksList } from './tasksList.jsx'
import { TaskExpanded } from './taskExpanded.jsx'

export class Tasks extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      headerVisible: false,
      listName: this.getListName(props.match.params.list)
    }
  }
  componentDidMount() {
    NitroSdk.bind('update', this.tasksUpdate)
    TasksExpandedService.setGo(this.props.history.push) // hack for now
  }
  componentWillUnmount() {
    NitroSdk.unbind('update', this.tasksUpdate)
  }
  tasksUpdate = (event, listId) => {
    if (event === 'lists') {
      this.setState({
        listName: this.getListName(this.props.match.params.list)
      })
    }
  }
  getListName(listId) {
    const list = NitroSdk.getList(listId)
    return list.name
  }
  // TODO: This shoud be intersectionObserver, but MVP I got too carried away last time.
  triggerScroll = e => {
    const scrollHeight = e.nativeEvent.contentOffset.y
    if (this.state.headerVisible === true && scrollHeight <= 56) {
      requestAnimationFrame(() => this.setState({ headerVisible: false }))
    } else if (this.state.headerVisible === false && scrollHeight > 56) {
      requestAnimationFrame(() => this.setState({ headerVisible: true }))
    }
  }
  render() {
    const listId = this.props.match.params.list

    let wrapperStyles = styles.wrapper
    if (this.props.transitionState === 'exiting') {
      wrapperStyles = [styles.wrapper, styles.wrapperExiting]
    }
    return (
      <View style={wrapperStyles}>
        <MaterialHeader
          fixed={true}
          leftIcon="back"
          leftAction={this.props.history.goBack}
          h1Visible={this.state.headerVisible}
          h1={this.state.listName}
        />
        <Header listId={listId} />
        <TasksInput listId={listId} />
        <TasksList listId={listId} />
        <TaskExpanded triggerBack={this.props.history.goBack} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    paddingTop: vars.materialHeaderHeight
  },
  wrapperExiting: {
    ...exitStyles,
    zIndex: -1
  }
})
