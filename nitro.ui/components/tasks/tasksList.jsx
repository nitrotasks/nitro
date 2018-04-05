import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, StyleSheet } from 'react-native'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import { NitroSdk } from '../../../nitro.sdk'
import { vars } from '../../styles.js'
import { Task } from './task.jsx'

export class TasksList extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.generateState(props)
  }
  generateState(props) {
    const list = NitroSdk.getTasks(props.listId)
    return {
      order: list.order
    }
  }
  componentDidMount() {
    NitroSdk.bind('update', this.tasksUpdate)
    NitroSdk.bind('order', this.orderUpdate)
  }
  componentWillUnmount() {
    NitroSdk.unbind('update', this.tasksUpdate)
    NitroSdk.unbind('order', this.orderUpdate)
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
    return (
      <View style={styles.wrapper}>
        <DragDropContext onDragEnd={this.triggerDragEnd}>
          <Droppable droppableId="tasksList">
            {(provided, snapshot) => (
              <div ref={provided.innerRef}>
                {this.state.order.map((taskId, index) => {
                  const task = NitroSdk.getTask(taskId)
                  return (
                    <Task
                      key={task.id}
                      listId={this.props.listId}
                      data={task}
                      index={index}
                    />
                  )
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </View>
    )
  }
}
TasksList.propTypes = {
  listId: PropTypes.string
}
const styles = StyleSheet.create({
  wrapper: {
    paddingLeft: vars.padding / 2,
    paddingRight: vars.padding / 2
  }
})
