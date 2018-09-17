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
import { TasksExpandedService } from '../../services/tasksExpandedService.js'
import { UiService } from '../../services/uiService.js'
import { Task } from './task.jsx'

import archiveIcon from '../../../assets/icons/material/archive.svg'

export class TasksList extends React.PureComponent {
  static propTypes = {
    listId: PropTypes.string
  }
  static getDerivedStateFromProps(props, state) {
    return props.listId !== state.previousId
      ? TasksList.generateState(props)
      : null
  }
  static generateState(props) {
    const list = NitroSdk.getTasks(props.listId)
    const taskMap = new Map()
    let order = []
    if (list !== null) {
      order = list.order
      list.tasks.forEach(task => {
        taskMap.set(task.id, task)
      })
    }

    UiService.state.currentListTasksOrder = order
    return {
      previousId: props.listId,
      order: order,
      tasks: taskMap
    }
  }
  constructor(props) {
    super(props)
    this.state = {
      currentTaskHeight: 0,
      ...this.constructor.generateState(props)
    }
    this.currentItemIndex = 0
    this.archiveButton = React.createRef()
    this.tasksContainer = React.createRef()
  }
  componentDidMount() {
    NitroSdk.bind('update', this.tasksUpdate)
    NitroSdk.bind('order', this.tasksUpdate)
    TasksExpandedService.bind('height', this.triggerShow)
    TasksExpandedService.bind('hide', this.triggerHide)
  }
  componentWillUnmount() {
    NitroSdk.unbind('update', this.tasksUpdate)
    NitroSdk.unbind('order', this.tasksUpdate)
    TasksExpandedService.unbind('height', this.triggerShow)
    TasksExpandedService.unbind('hide', this.triggerHide)
  }
  tasksUpdate = () => {
    // captures all updates for all lists, because the today and next lists are special
    this.setState(this.constructor.generateState(this.props))
  }
  triggerShow = height => {
    this.currentItemIndex = this.state.order.indexOf(
      TasksExpandedService.state.task
    )
    const archive = findNodeHandle(this.archiveButton.current)
    requestAnimationFrame(() => {
      Array.from(findNodeHandle(this.tasksContainer.current).children)
        .slice(this.currentItemIndex)
        .forEach((item, key) => {
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
      Array.from(findNodeHandle(this.tasksContainer.current).children)
        // this breaks things, and who cares if a bit of performance suffers as a result
        // .slice(this.currentItemIndex)
        .forEach(item => {
          item.style.transform = ''
        })
      const archive = findNodeHandle(this.archiveButton.current)
      if (archive) {
        archive.style.transform = ''
      }
    })
  }
  triggerArchive = () => {
    NitroSdk.archiveCompletedList(this.props.listId)
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
            <View style={styles.archiveButton}>
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

    return (
      <View ref={this.tasksContainer} style={styles.wrapper}>
        {this.state.order.map((taskId, index) => {
          const task = this.state.tasks.get(taskId)
          // if taskid matches ocorrect one get position in dom, pass to overlay etc etc
          // const selected = taskId === this.props.match.params.task
          const selected = false
          const selectedHeight = selected ? this.state.currentTaskHeight : 0
          if (task.type === 'header') {
            currentHeading = task.id
            headerCollapsed = false
          } else if (task.type === 'header-collapsed') {
            headerCollapsed = true
          } else if (task.type === 'archived' || headerCollapsed === true) {
            return (
              <Draggable
                key={task.id}
                draggableId={'tasks-' + task.id}
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
              key={task.id}
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
              selected={selected}
              selectedHeight={selectedHeight}
              selectedCallback={this.triggerSelected}
              headersAllowed={headersAllowed}
              currentHeading={currentHeading}
              dragDisabled={orderNotAllowed}
            />
          )
        })}
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
  }
})
