import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import { NitroSdk } from '../../../nitro.sdk'
import { vars } from '../../styles.js'
import { TasksExpandedService } from '../../services/tasksExpandedService.js'
import { UiService } from '../../services/uiService.js'
import { DroppableScrollableWrapper } from '../reusable/droppableScrollableWrapper.jsx'
import { Header } from './header.jsx'
import { TasksInput } from './tasksInput.jsx'
import { SortBar } from './sortBar.jsx'
import { TasksList } from './tasksList.jsx'
import { TaskExpanded } from './taskExpanded.jsx'
import { Datepicker } from '../datepicker.jsx'

export class Tasks extends React.Component {
  state = {
    pointerEvents: TasksExpandedService.state.task === null,
    lastUpdate: new Date(),
    desktop: false
  }

  componentDidMount() {
    TasksExpandedService.setGo(
      this.props.history.push,
      this.props.history.replace
    ) // hack for now

    TasksExpandedService.bind('show', this.triggerExpanded('show'))
    TasksExpandedService.bind('hide', this.triggerExpanded('hide'))
    NitroSdk.bind('update', this.triggerUpdate)
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

  triggerUpdate = key => {
    if (key === 'lists') {
      const { list } = this.props.match.params
      // TODO: this hack sucks. forces a re-render if the list has been deleted.
      // really, the props need to change automatically
      if (NitroSdk.getList(list) === null) {
        this.setState({ lastUpdate: new Date() })
      }
    }
  }

  triggerLayout = () => {
    const { desktop } = this.state
    if (window.innerWidth > 850 && desktop === false) {
      this.setState({ desktop: true })
    } else if (window.innerWidth <= 850 && desktop === true) {
      this.setState({ desktop: false })
    }
  }

  render() {
    const { list } = this.props.match.params
    const { pointerEvents, desktop } = this.state
    if (NitroSdk.getList(list) === null) {
      return (
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>
            Error 404: This list could not be found, or has been deleted.
          </Text>
        </View>
      )
    }
    const style = desktop
      ? [styles.tasksWrapper, styles.desktop]
      : pointerEvents
      ? styles.tasksWrapper
      : [styles.tasksWrapper, styles.mobileOpacity]

    // used for the drag and drop
    UiService.state.currentList = list
    return (
      <View style={styles.wrapper}>
        <DroppableScrollableWrapper id="tasksDroppable" overflowType="scroll">
          <View onClick={this.triggerClick}>
            <View
              onLayout={this.triggerLayout}
              style={style}
              pointerEvents={pointerEvents ? 'auto' : 'none'}
            >
              <Header listId={list} onIntersect={this.triggerIntersection} />
              <TasksInput listId={list} />
              <SortBar listId={list} />
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
  },
  desktop: {
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  mobileOpacity: {
    opacity: 0.5
  },
  notFound: {
    padding: vars.padding
  },
  notFoundText: {
    fontFamily: vars.fontFamily
  }
})
