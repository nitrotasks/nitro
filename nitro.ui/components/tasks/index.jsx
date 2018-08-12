import React from 'react'
import { View, StyleSheet } from 'react-native'

import { NitroSdk } from '../../../nitro.sdk'
import { TasksExpandedService } from '../../services/tasksExpandedService.js'
import { UiService } from '../../services/uiService.js'
import { Header } from './header.jsx'
import { TasksInput } from './tasksInput.jsx'
import { TasksList } from './tasksList.jsx'
import { TaskExpanded } from './taskExpanded.jsx'
import { Datepicker } from '../datepicker.jsx'

export class Tasks extends React.Component {
  componentDidMount() {
    TasksExpandedService.setGo(this.props.history.push) // hack for now
  }
  componentWillUnmount() {
    NitroSdk.unbind('update', this.tasksUpdate)
  }
  triggerIntersection = e => {
    const newPos = !e[0].isIntersecting
    if (UiService.state.listIntersection !== newPos) {
      UiService.state.listIntersection = newPos
      UiService.trigger('list-intersection')
    }
  }

  render() {
    const listId = this.props.match.params.list
    return (
      <View style={styles.wrapper}>
        <Header listId={listId} onIntersect={this.triggerIntersection} />
        <TasksInput listId={listId} />
        <TasksList listId={listId} />
        <TaskExpanded triggerBack={this.props.history.goBack} />
        <Datepicker pickerId="expanded" position="sheet" />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  wrapper: {
    height: '100%'
  }
})
