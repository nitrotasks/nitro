import React from 'react'
import { View, StyleSheet } from 'react-native'

import { vars } from '../../styles.js'
import { TasksExpandedService } from '../../services/tasksExpandedService.js'
import { UiService } from '../../services/uiService.js'
import { DroppableScrollableWrapper } from '../reusable/droppableScrollableWrapper.jsx'
import { Header } from './header.jsx'
import { TasksInput } from './tasksInput.jsx'
import { TasksList } from './tasksList.jsx'
import { TaskExpanded } from './taskExpanded.jsx'
import { Datepicker } from '../datepicker.jsx'

export class Tasks extends React.Component {
  state = {
    pointerEvents: TasksExpandedService.state.task === null
  }
  componentDidMount() {
    TasksExpandedService.setGo(
      this.props.history.push,
      this.props.history.replace
    ) // hack for now

    TasksExpandedService.bind('show', this.triggerExpanded('show'))
    TasksExpandedService.bind('hide', this.triggerExpanded('hide'))
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
  triggerExpanded = event => {
    return () => {
      // TODO: this is a bit of a hack
      requestAnimationFrame(() => {
        this.setState({
          pointerEvents: event === 'hide'
        })
      })
    }
  }

  render() {
    const { list } = this.props.match.params
    const pointerEvents = this.state.pointerEvents ? 'auto' : 'none'
    const pointerEventsClassName =
      'desktop-90' +
      (this.state.pointerEvents ? '' : ' desktop-opacity-invisible')

    // used for the drag and drop
    UiService.state.currentList = list
    return (
      <View style={styles.wrapper}>
        <DroppableScrollableWrapper id="tasksDroppable">
          <View onClick={this.triggerClick}>
            <View
              style={styles.tasksWrapper}
              pointerEvents={pointerEvents}
              className={pointerEventsClassName}
            >
              <Header listId={list} onIntersect={this.triggerIntersection} />
              <TasksInput listId={list} />
              <TasksList listId={list} />
            </View>
          </View>
          <TaskExpanded listId={list} />
        </DroppableScrollableWrapper>
        <Datepicker pickerId="expanded" position="sheet" />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  wrapper: {
    height: '100%'
  },
  tasksWrapper: {
    willChange: 'opacity',
    minHeight: 'var(--real-height)',
    transitionDuration: '300ms',
    transitionProperty: 'opacity',
    transitionTimingFunction: 'ease',
    paddingBottom: vars.padding * 2
  }
})
