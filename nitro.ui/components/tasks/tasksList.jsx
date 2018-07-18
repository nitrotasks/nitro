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
import { DragDropContext, Droppable } from 'react-beautiful-dnd'

import { NitroSdk } from '../../../nitro.sdk'
import { vars } from '../../styles.js'
import { TasksExpandedService } from '../../services/tasksExpandedService.js'
import { Task } from './task.jsx'

import archiveIcon from '../../../assets/icons/material/archive.svg'

export class TasksList extends React.PureComponent {
  static propTypes = {
    listId: PropTypes.string
  }
  constructor(props) {
    super(props)
    this.state = {
      currentTaskHeight: 0,
      ...this.generateState(props)
    }
    this.currentItemIndex = 0
    this.tasksContainer = null
    this.archiveButton = React.createRef()
  }
  generateState(props) {
    const list = NitroSdk.getTasks(props.listId)
    const taskMap = new Map()
    list.tasks.forEach(task => {
      taskMap.set(task.id, task)
    })

    return {
      order: list.order,
      tasks: taskMap
    }
  }
  componentDidMount() {
    NitroSdk.bind('update', this.tasksUpdate)
    NitroSdk.bind('order', this.orderUpdate)
    TasksExpandedService.bind('height', this.triggerShow)
    TasksExpandedService.bind('hide', this.triggerHide)
  }
  componentWillUnmount() {
    NitroSdk.unbind('update', this.tasksUpdate)
    NitroSdk.unbind('order', this.orderUpdate)
    TasksExpandedService.unbind('height', this.triggerShow)
    TasksExpandedService.unbind('hide', this.triggerHide)
  }
  tasksUpdate = event => {
    // captures all updates for all lists, because the today and next lists are special
    if (event === 'tasks') {
      this.setState(this.generateState(this.props))
    }
  }
  orderUpdate = () => {
    this.setState(this.generateState(this.props))
  }
  triggerShow = height => {
    this.currentItemIndex = this.state.order.indexOf(
      TasksExpandedService.state.task
    )
    const archive = findNodeHandle(this.archiveButton.current)
    requestAnimationFrame(() => {
      Array.from(this.tasksContainer.children)
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
      Array.from(this.tasksContainer.children)
        .slice(this.currentItemIndex)
        .forEach(item => {
          item.style.transform = ''
        })
      const archive = findNodeHandle(this.archiveButton.current)
      if (archive) {
        archive.style.transform = ''
      }
    })
  }
  triggerDragEnd = result => {
    if (!result.destination) {
      return
    }
    if (result.source.index === result.destination.index) {
      return
    }

    const order = this.state.order.slice()
    order.splice(result.source.index, 1)
    order.splice(result.destination.index, 0, result.draggableId)
    NitroSdk.updateOrder(this.props.listId, order)
  }
  triggerArchive = () => {
    NitroSdk.archiveCompletedList(this.props.listId)
  }
  render() {
    const mutable = NitroSdk.getList(this.props.listId).mutable
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

    return (
      <View style={styles.wrapper}>
        <DragDropContext onDragEnd={this.triggerDragEnd}>
          <Droppable droppableId="tasksList" isDropDisabled={orderNotAllowed}>
            {provided => {
              let currentHeading = ''
              return (
                <div
                  ref={e => {
                    provided.innerRef(e)
                    this.tasksContainer = e
                  }}
                >
                  {this.state.order.map((taskId, index) => {
                    const task = this.state.tasks.get(taskId)
                    // if taskid matches ocorrect one get position in dom, pass to overlay etc etc
                    // const selected = taskId === this.props.match.params.task
                    const selected = false
                    const selectedHeight = selected
                      ? this.state.currentTaskHeight
                      : 0
                    if (task.type === 'header') {
                      currentHeading = task.id
                    } else if (task.type === 'archived') {
                      return <View key={task.id} />
                    }
                    return (
                      <Task
                        key={task.id}
                        listId={this.props.listId}
                        dataId={task.id}
                        dataName={task.name}
                        dataType={task.type}
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
                  {provided.placeholder}
                </div>
              )
            }}
          </Droppable>
        </DragDropContext>
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
