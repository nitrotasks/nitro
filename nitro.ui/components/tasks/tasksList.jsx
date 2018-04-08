import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, StyleSheet } from 'react-native'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Route, withRouter } from 'react-router'

import { NitroSdk } from '../../../nitro.sdk'
import { vars } from '../../styles.js'
import { Task } from './task.jsx'
import { TaskExpanded } from './taskExpanded.jsx'

export class TasksListWithoutRouter extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.generateState(props)
  }
  generateState(props) {
    const list = NitroSdk.getTasks(props.listId)
    return {
      order: list.order,
      overlayPosition: null
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
  triggerSelected = (y, pageY) => {
    this.setState({
      overlayPosition: y
    })
  }
  render() {
    return (
      <View style={styles.wrapper}>
        <Route
          exact
          path="/:list/:task"
          render={routeProps => (
            <TaskExpanded
              {...routeProps}
              position={this.state.overlayPosition}
            />
          )}
        />
        <DragDropContext onDragEnd={this.triggerDragEnd}>
          <Droppable droppableId="tasksList">
            {(provided, snapshot) => (
              <div ref={provided.innerRef}>
                {this.state.order.map((taskId, index) => {
                  const task = NitroSdk.getTask(taskId)
                  // if taskid matches ocorrect one get position in dom, pass to overlay etc etc
                  const selected = taskId === this.props.match.params.task
                  return (
                    <Task
                      key={task.id}
                      listId={this.props.listId}
                      data={task}
                      index={index}
                      selected={selected}
                      selectedCallback={this.triggerSelected}
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
TasksListWithoutRouter.propTypes = {
  listId: PropTypes.string
}
const styles = StyleSheet.create({
  wrapper: {
    paddingLeft: vars.padding / 2,
    paddingRight: vars.padding / 2
  }
})
export const TasksList = withRouter(TasksListWithoutRouter)
