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
  triggerClick = e => {
    if (
      e.target === e.currentTarget &&
      TasksExpandedService.state.task !== null
    ) {
      TasksExpandedService.triggerBack()
    }
  }

  render() {
    const listId = this.props.match.params.list
    const pointerEvents =
      TasksExpandedService.state.task === null ? 'auto' : 'none'

    // used for the drag and drop
    UiService.state.currentList = listId
    return (
      <View style={styles.wrapper}>
        <DroppableScrollableWrapper id="tasksDroppable">
          <View onClick={this.triggerClick}>
            <View pointerEvents={pointerEvents} className="desktop-90">
              <Header listId={listId} onIntersect={this.triggerIntersection} />
              <TasksInput listId={listId} />
              <TasksList listId={listId} />
            </View>
          </View>
          <TaskExpanded listId={listId} />
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
