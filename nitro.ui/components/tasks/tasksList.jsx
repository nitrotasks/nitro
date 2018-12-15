import React from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  findNodeHandle
} from 'react-native'
import { Draggable } from 'react-beautiful-dnd'

import { NitroSdk } from '../../../nitro.sdk'
import { vars } from '../../styles.js'
import { ModalService } from '../../services/modalService.js'
import { TasksExpandedService } from '../../services/tasksExpandedService.js'
import { UiService } from '../../services/uiService.js'
import { Task } from './task.jsx'
import { EmptyList } from './emptyList.jsx'

import archiveIcon from '../../../assets/icons/material/archive.svg'

const ARCHIVE_MULTIPLE_WARNING =
  'Are you sure you want to archive these tasks?\n\nYou currently can’t view archived tasks in Nitro.'

export class TasksList extends React.PureComponent {
  static propTypes = {
    listId: PropTypes.string
  }
  static getDerivedStateFromProps(props, state) {
    return props.listId !== state.previousId
      ? TasksList.generateState(props, true)
      : null
  }
  static generateState(props, newList = false) {
    const { listId } = props
    const list = NitroSdk.getTasks(listId)
    const taskMap = new Map()
    let order = []
    if (list !== null) {
      order = list.order
      list.tasks.forEach(task => {
        taskMap.set(task.id, task)
      })
    }

    UiService.state.currentListTasksOrder = order
    const newState = {
      previousId: props.listId,
      order: order,
      tasks: taskMap
    }
    if (newList && NitroSdk.isSignedIn(true)) {
      const syncingTasks = NitroSdk.getTasksSyncStatus(props.listId)
      newState.syncingTasks = syncingTasks.post.concat(syncingTasks.patch)
    }
    if (newList) {
      UiService.scrollTo({ top: 0 })
    }
    return newState
  }
  constructor(props) {
    super(props)
    this.state = {
      syncingTasks: [],
      ...this.constructor.generateState(props, true),
      currentTaskHeight: 0
    }

    this.pendingChanges = false
    this.currentItemIndex = 0
    this.archiveButton = React.createRef()
    this.tasksContainer = React.createRef()
    UiService.tasksContainer = this.tasksContainer
  }
  componentDidMount() {
    NitroSdk.bind('update', this.tasksUpdate)
    NitroSdk.bind('order', this.tasksUpdate)
    NitroSdk.bind('sync-upload-start', this.syncingTasksUpdate)
    NitroSdk.bind('sync-upload-complete', this.syncingTasksUpdate)
    TasksExpandedService.bind('height', this.triggerShow)
    TasksExpandedService.bind('hide', this.triggerHide)
    this.scheduleTasksUpdate()
  }
  componentWillUnmount() {
    NitroSdk.unbind('update', this.tasksUpdate)
    NitroSdk.unbind('order', this.tasksUpdate)
    NitroSdk.unbind('sync-upload-start', this.syncingTasksUpdate)
    NitroSdk.unbind('sync-upload-complete', this.syncingTasksUpdate)
    TasksExpandedService.unbind('height', this.triggerShow)
    TasksExpandedService.unbind('hide', this.triggerHide)
    clearTimeout(this.nextDayUpdate)
  }
  scheduleTasksUpdate = () => {
    // re-renders every hour
    const d = new Date()
    const m = d.getMinutes()
    const s = d.getSeconds()
    const nextRender = (60 * 60 - m * 60 - s + 10) * 1000
    this.nextDayUpdate = setTimeout(() => {
      this.tasksUpdate()
      this.scheduleTasksUpdate()
    }, nextRender)
  }
  tasksUpdate = () => {
    // doesn't do anything if the task is expanded
    if (TasksExpandedService.state.task !== null) {
      this.pendingChanges = true
      return
    }

    // captures all updates for all lists, because the today and next lists are special
    this.setState({
      ...this.constructor.generateState(this.props)
    })
  }
  syncingTasksUpdate = () => {
    if (!NitroSdk.isSignedIn(true)) return
    const syncingTasks = NitroSdk.getTasksSyncStatus(this.props.listId)
    const newState = syncingTasks.post.concat(syncingTasks.patch)

    // avoids a set state
    if (JSON.stringify(this.state.syncingTasks) === JSON.stringify(newState)) {
      return
    }
    this.setState({
      syncingTasks: newState
    })
  }
  triggerShow = height => {
    this.currentItemIndex = this.state.order.indexOf(
      TasksExpandedService.state.task
    )
    const archive = findNodeHandle(this.archiveButton.current)
    requestAnimationFrame(() => {
      const index = this.currentItemIndex < 0 ? 0 : this.currentItemIndex + 1
      const nodes = Array.from(
        findNodeHandle(this.tasksContainer.current).children
      ).slice(index)

      // if the new button is pressed, we need to offset it, because this is a zero-height spacer
      if (index === 0 && nodes.length > 1) {
        const taskHeight = nodes[1].getBoundingClientRect().height
        height += taskHeight
      }

      nodes.forEach((item, key) => {
        const pixels = key === 0 ? vars.padding * 2 : height
        item.style.transform = `translate3d(0,${pixels}px,0)`
      })
      if (archive) {
        archive.style.transform = `translate3d(0,${height}px,0)`
      }
    })
  }
  triggerHide = () => {
    requestAnimationFrame(() => {
      Array.from(findNodeHandle(this.tasksContainer.current).children).forEach(
        i => {
          i.style.transform = ''
        }
      )
      const archive = findNodeHandle(this.archiveButton.current)
      if (archive) {
        archive.style.transform = ''
      }

      // if there was an update while the modal was showing, trigger them now
      if (this.pendingChanges) {
        this.pendingChanges = false
        setTimeout(this.tasksUpdate, 300)
      }
    })
  }
  triggerArchive = () => {
    ModalService.show(
      {
        message: ARCHIVE_MULTIPLE_WARNING,
        confirmText: 'Archive Tasks',
        confirmColor: vars.positiveColor,
        cancelText: 'Cancel'
      },
      () => NitroSdk.archiveCompletedList(this.props.listId)
    )
  }
  render() {
    const list = NitroSdk.getList(this.props.listId)
    if (list === null) {
      return <Text>This list cannot be found, or has been deleted.</Text>
    }

    const mutable = list.mutable

    const headersAllowed = !mutable.includes('no-headings')
    const orderNotAllowed = mutable.includes('no-order')

    const signedIn = NitroSdk.isSignedIn()
    const completedTasks = Array.from(this.state.tasks).filter(obj => {
      const task = obj[1]
      if (
        signedIn ||
        (task.serverId !== null && typeof task.serverId !== 'undefined')
      ) {
        return (
          task.completed !== null &&
          typeof task.completed !== 'undefined' &&
          task.type !== 'archived'
        )
      }
      return false
    }).length

    let archiveButton = null
    if (completedTasks > 0 && !orderNotAllowed) {
      archiveButton = (
        <View ref={this.archiveButton} style={styles.archiveButtonWrapper}>
          <TouchableOpacity onClick={this.triggerArchive}>
            <View style={styles.archiveButton} className="hover-5">
              <Image
                accessibilityLabel="Archive Icon"
                source={archiveIcon}
                resizeMode="contain"
                style={styles.archiveIcon}
              />
              <Text style={styles.archiveButtonText}>
                Archive {completedTasks} completed tasks
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )
    }

    let currentHeading = ''
    let headerCollapsed = false

    const order = this.state.order

    return (
      <View ref={this.tasksContainer} style={styles.wrapper}>
        <div className="new-task-spacer" />
        {order.map((taskId, index) => {
          const task = this.state.tasks.get(taskId)
          if (
            task === undefined ||
            task.type === 'archived' ||
            headerCollapsed === true
          ) {
            return (
              <Draggable
                key={taskId}
                draggableId={'tasks-' + taskId}
                index={index}
                isDragDisabled={true}
              >
                {provided => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  />
                )}
              </Draggable>
            )
          } else if (task.type === 'header') {
            currentHeading = task.id
            headerCollapsed = false
          } else if (task.type === 'header-collapsed') {
            headerCollapsed = true
          }
          return (
            <Task
              key={`${this.props.listId}-${task.id}`}
              listId={this.props.listId}
              dataId={task.id}
              dataName={task.name}
              dataType={task.type}
              dataHeading={task.heading}
              dataNotes={task.notes}
              dataDate={task.date}
              dataDeadline={task.deadline}
              dataList={task.list}
              dataCompleted={task.completed}
              index={index}
              headersAllowed={headersAllowed}
              currentHeading={currentHeading}
              dragDisabled={orderNotAllowed}
              syncing={this.state.syncingTasks.includes(task.id)}
            />
          )
        })}
        {order.length === 0 ? <EmptyList listId={this.props.listId} /> : null}
        {archiveButton}
      </View>
    )
  }
}
const styles = StyleSheet.create({
  wrapper: {
    paddingLeft: vars.padding / 2,
    paddingRight: vars.padding / 2,
    paddingBottom: vars.padding * 4
  },
  archiveButtonWrapper: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: vars.padding,
    paddingBottom: vars.padding,
    paddingLeft: vars.padding / 4,
    transitionDuration: '300ms',
    transitionTimingFunction: 'ease',
    transitionProperty: 'transform'
  },
  archiveButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#ccc',
    borderRadius: 3,
    paddingLeft: vars.padding * 0.75,
    paddingRight: vars.padding * 0.75,
    paddingTop: vars.padding / 2,
    paddingBottom: vars.padding / 2
  },
  archiveIcon: {
    height: 11,
    width: 12
  },
  archiveButtonText: {
    textIndent: vars.padding * 0.375,
    fontFamily: vars.fontFamily,
    fontSize: 14
  },
  loadingText: {
    lineHeight: 50,
    textIndent: vars.padding * 0.375,
    fontFamily: vars.fontFamily,
    fontSize: 14
  }
})
