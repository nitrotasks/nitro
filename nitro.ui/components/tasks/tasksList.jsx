import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, Image, StyleSheet, findNodeHandle } from 'react-native'
import { Draggable } from 'react-beautiful-dnd'

import { NitroSdk } from '../../../nitro.sdk'
import { vars } from '../../styles.js'
import { ModalService } from '../../services/modalService.js'
import { TasksExpandedService } from '../../services/tasksExpandedService.js'
import { ShortcutsService } from '../../services/shortcutsService.js'
import { UiService } from '../../services/uiService.js'
import { Task } from './task.jsx'
import { EmptyList } from './emptyList.jsx'
import { TouchableOpacity } from '../reusable/touchableOpacity.jsx'

import archiveIcon from '../../../assets/icons/material/archive.svg'

const DOWN_HOTKEY = 'j'
const UP_HOTKEY = 'k'
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
      ...this.constructor.generateState(props, true)
    }

    this.pendingChanges = false
    this.originalHeight = 0
    this.tasksContainer = React.createRef()
    this.tasksContainerEnd = React.createRef()
    this.archiveButton = React.createRef()
    UiService.tasksContainer = this.tasksContainer

    this.observer = new IntersectionObserver(this.triggerIntersect, {
      root: null,
      threshold: 0
    })
    this.isIntersecting = false
  }
  archiveTransform = null
  componentDidMount() {
    NitroSdk.bind('update', this.triggerUpdate)
    NitroSdk.bind('order', this.triggerOrder)
    NitroSdk.bind('request-process', this.syncingTasksUpdate)
    NitroSdk.bind('sync-queue-lock', this.syncingTasksUpdate)
    NitroSdk.bind('sync-upload-start', this.syncingTasksUpdate)
    NitroSdk.bind('sync-upload-complete', this.syncingTasksUpdate)
    TasksExpandedService.bind('height', this.triggerHeight)
    TasksExpandedService.bind('hide', this.triggerHide)
    ShortcutsService.bind(UP_HOTKEY, this.triggerHotkey)
    ShortcutsService.bind(DOWN_HOTKEY, this.triggerHotkey)
    this.scheduleTasksUpdate()
    this.observer.observe(findNodeHandle(this.tasksContainerEnd.current))
  }
  componentWillUnmount() {
    NitroSdk.unbind('update', this.triggerUpdate)
    NitroSdk.unbind('order', this.triggerOrder)
    NitroSdk.unbind('sync-upload-start', this.syncingTasksUpdate)
    NitroSdk.unbind('sync-upload-complete', this.syncingTasksUpdate)
    TasksExpandedService.unbind('height', this.triggerHeight)
    TasksExpandedService.unbind('hide', this.triggerHide)
    ShortcutsService.unbind(UP_HOTKEY, this.triggerHotkey)
    ShortcutsService.unbind(DOWN_HOTKEY, this.triggerHotkey)
    clearTimeout(this.nextDayUpdate)
    this.observer.disconnect()
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
  triggerUpdate = () => {
    this.tasksUpdate('update')
  }
  triggerOrder = () => {
    this.tasksUpdate('order')
  }
  tasksUpdate = event => {
    // doesn't do anything if the task is expanded
    const newState = this.constructor.generateState(this.props)
    const { task } = TasksExpandedService.state
    if (this.pendingChanges === true) {
      return
    } else if (task !== null && task !== 'new') {
      // this keeps our today & next lists tidy
      if (newState.order.toString() === this.state.order.toString()) {
        this.setState(newState)
      } else {
        this.pendingChanges = true
      }
    } else if (task === 'new') {
      if (event === 'update') return
      if (this.props.listId === 'today' || this.props.listId === 'next') {
        this.pendingChanges = true
        return
      }
      this.setState(newState, () => {
        this.triggerHeight(this.originalHeight, false)
      })
    } else {
      this.setState(newState)
    }
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
  triggerHeight = (height, animate = true) => {
    requestAnimationFrame(() => {
      const currentItemIndex = this.state.order.indexOf(
        TasksExpandedService.state.task
      )
      const archive = findNodeHandle(this.archiveButton.current)
      const index = currentItemIndex < 0 ? 0 : currentItemIndex + 1
      const tasksContainer = findNodeHandle(this.tasksContainer.current)
      const nodes = Array.from(tasksContainer.children).slice(index)

      if (animate === false) {
        nodes.forEach(item => {
          item.style.transitionDuration = '0ms'
        })
        if (archive) archive.style.transitionDuration = '0ms'
        requestAnimationFrame(() => {
          nodes.forEach(item => {
            item.style.transitionDuration = ''
          })
          if (archive) archive.style.transitionDuration = ''
        })
      }

      // if the new button is pressed, we need to offset it, because this is a zero-height spacer
      if (index === 0 && nodes.length > 1) {
        const taskHeight = nodes[1].getBoundingClientRect().height
        this.originalHeight = height
        height += taskHeight
      }

      tasksContainer.style.paddingBottom = `${height}px`
      nodes.forEach((item, key) => {
        const pixels = key === 0 ? vars.padding * 2 : height
        item.style.transform = `translate3d(0,${pixels}px,0)`
      })

      this.archiveTransform = [{ translateY: `${height}px` }]
      this.archiveTransformList = this.props.listId
      if (archive) archive.style.transform = `translate3d(0,${height}px,0)`
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
      this.archiveTransform = null
      this.archiveTransformList = null
      if (archive) archive.style.transform = ''
      this.resetPadding()

      // if there was an update while the modal was showing, trigger them now
      if (this.pendingChanges) {
        setTimeout(() => {
          this.pendingChanges = false
          this.tasksUpdate()
        }, 300)
      }
    })
  }
  triggerHotkey = (event, key) => {
    if (key === DOWN_HOTKEY) {
      const node = findNodeHandle(this.tasksContainer.current).querySelector(
        '[tabIndex="0"]'
      )
      if (node) node.focus()
    } else if (key === UP_HOTKEY) {
      const node = Array.from(
        findNodeHandle(this.tasksContainer.current).querySelectorAll(
          '[tabIndex="0"]'
        )
      ).slice(-1)[0]
      if (node) node.focus()
    }
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
  triggerArchiveKeyDown = e => {
    const keycode = e.keyCode
    if (keycode === 13) {
      this.triggerArchive()
      e.currentTarget.blur()
    } else if (keycode === 27) {
      e.currentTarget.blur()
    } else if (keycode === 38 || keycode === 75) {
      const node = e.currentTarget.parentNode.previousSibling.children[0]
      if (node) node.focus()
      e.preventDefault()
    }
  }
  triggerIntersect = e => {
    // Weirdly, when the overlay is opened in Chrome, this is hit
    // Works fine in Safari & Firefox.
    this.isIntersecting = e[0].isIntersecting
    this.resetPadding()
  }
  resetPadding = () => {
    const style = findNodeHandle(this.tasksContainer.current).style
    if (this.isIntersecting === false && style.paddingBottom !== '0px') {
      setTimeout(() => {
        requestAnimationFrame(() => {
          if (TasksExpandedService.state.task === null) {
            style.paddingBottom = '0px'
            TasksExpandedService.triggerPosition(0)
          }
        })
      }, 300)
    }
  }
  render() {
    const list = NitroSdk.getList(this.props.listId)
    let mutable = []
    if (list !== null) {
      mutable = list.mutable
    }

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
      const { archiveTransform, archiveTransformList } = this
      const archiveStyles =
        archiveTransform !== null && archiveTransformList === this.props.listId
          ? [styles.archiveButtonWrapper, { transform: archiveTransform }]
          : styles.archiveButtonWrapper
      archiveButton = (
        <View ref={this.archiveButton} style={archiveStyles}>
          <TouchableOpacity
            onClick={this.triggerArchive}
            accessible={true}
            onKeyDown={this.triggerArchiveKeyDown}
          >
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
          const taskType = task ? task.type : null

          if (taskType === 'header') {
            currentHeading = task.id
            headerCollapsed = false
          } else if (taskType === 'header-collapsed') {
            headerCollapsed = true
          } else if (
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
              dataPriority={task.priority}
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
        <div ref={this.tasksContainerEnd} />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  wrapper: {
    paddingLeft: vars.padding / 2,
    paddingRight: vars.padding / 2
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
