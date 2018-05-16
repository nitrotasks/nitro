import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, StyleSheet } from 'react-native'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'

import { NitroSdk } from '../../../nitro.sdk'
import { vars } from '../../styles.js'
import { TasksExpandedService } from '../../services/tasksExpandedService.js'
import { Task } from './task.jsx'

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
    TasksExpandedService.bind('show', this.triggerShow)
    TasksExpandedService.bind('hide', this.triggerHide)
  }
  componentWillUnmount() {
    NitroSdk.unbind('update', this.tasksUpdate)
    NitroSdk.unbind('order', this.orderUpdate)
    TasksExpandedService.unbind('show', this.triggerShow)
    TasksExpandedService.unbind('hide', this.triggerHide)
  }
  tasksUpdate = (event, listId) => {
    // captures all updates for all lists, because the today and next lists are special
    if (event === 'tasks') {
      this.setState(this.generateState(this.props))
    }
  }
  orderUpdate = () => {
    this.setState(this.generateState(this.props))
  }
  triggerShow = () => {
    this.currentItemIndex = this.state.order.indexOf(
      TasksExpandedService.state.task
    )
    requestAnimationFrame(() => {
      Array.from(this.tasksContainer.children)
        .slice(this.currentItemIndex)
        .forEach((item, key) => {
          const pixels = key === 0 ? vars.padding * 2 : 180 // TODO: Magic Numbers!
          item.style.transform = `translate3d(0,${pixels}px,0)`
        })
    })
  }
  triggerHide = () => {
    requestAnimationFrame(() => {
      Array.from(this.tasksContainer.children)
        .slice(this.currentItemIndex)
        .forEach(item => {
          item.style.transform = ''
        })
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
  render() {
    const mutable = NitroSdk.getList(this.props.listId).mutable
    const headersAllowed = mutable.indexOf('no-headings') === -1
    const orderNotAllowed = mutable.indexOf('no-order') !== -1
    return (
      <View style={styles.wrapper}>
        <DragDropContext onDragEnd={this.triggerDragEnd}>
          <Droppable droppableId="tasksList" isDropDisabled={orderNotAllowed}>
            {(provided, snapshot) => {
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
                    }
                    return (
                      <Task
                        key={task.id}
                        listId={this.props.listId}
                        data={task}
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
      </View>
    )
  }
}
const styles = StyleSheet.create({
  wrapper: {
    paddingLeft: vars.padding / 2,
    paddingRight: vars.padding / 2
  }
})
