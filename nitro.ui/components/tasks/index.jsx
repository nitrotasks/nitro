import React from 'react'
import { View, StyleSheet } from 'react-native'

import { TasksExpandedService } from '../../services/tasksExpandedService.js'
import { UiService } from '../../services/uiService.js'
import { DroppableScrollableWrapper } from '../reusable/droppableScrollableWrapper.jsx'
import { Header } from './header.jsx'
import { TasksInput } from './tasksInput.jsx'
import { TasksList } from './tasksList.jsx'
import { TaskExpanded } from './taskExpanded.jsx'
import { Datepicker } from '../datepicker.jsx'

export class Tasks extends React.Component {
  componentDidMount() {
    TasksExpandedService.setGo(
      this.props.history.push,
      this.props.history.replace
    ) // hack for now
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

    // used for the drag and drop
    UiService.state.currentList = listId
    return (
      <View style={styles.wrapper}>
        <DroppableScrollableWrapper id="tasksDroppable" className="desktop-90">
          <Header listId={listId} onIntersect={this.triggerIntersection} />
          <TasksInput listId={listId} />
          <TasksList listId={listId} />
          <TaskExpanded triggerBack={this.props.history.goBack} />
        </DroppableScrollableWrapper>
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
