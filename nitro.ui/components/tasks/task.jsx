import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, StyleSheet } from 'react-native'
import { Draggable } from 'react-beautiful-dnd'
import { withRouter } from 'react-router-dom'

import { NitroSdk } from '../../../nitro.sdk'
import { vars } from '../../styles.js'
import { TasksExpandedService } from '../../services/tasksExpandedService.js'
import { Checkbox } from './checkbox.jsx'

class TaskComponent extends React.Component {
  static propTypes = {
    index: PropTypes.number,
    listId: PropTypes.string,
    data: PropTypes.object
  }
  constructor(props) {
    super(props)
    this.viewRef = React.createRef()
  }
  componentDidMount() {
    this.triggerPosition()
  }
  componentWillReceiveProps(newProps) {
    if (newProps.selected !== this.props.selected) {
      this.triggerPosition(newProps)
    }
  }
  triggerPosition = (newProps = this.props) => {
    if (newProps.selected) {
      this.viewRef.current.measure((x, y, width, height, pageX, pageY) => {
        newProps.selectedCallback(y, pageY)
      })
    }
  }
  triggerClick = () => {
    this.viewRef.current.measure((x, y, width, height, pageX, pageY) => {
      TasksExpandedService.triggerTask(
        this.props.listId,
        this.props.data.id,
        this.props.history.push,
        pageY
      )
    })
  }
  triggerCheckbox = e => {
    NitroSdk.completeTask(this.props.data.id)
  }
  render() {
    const item = this.props.data
    const innerStyles = {}
    if (this.props.selectedHeight > 0) {
      innerStyles.height = this.props.selectedHeight
    }
    return (
      <Draggable draggableId={item.id} index={this.props.index}>
        {(provided, snapshot) => (
          <View ref={this.viewRef}>
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={getItemStyle(
                snapshot.isDragging,
                provided.draggableProps.style
              )}
            >
              <View style={innerStyles}>
                <View style={styles.wrapper}>
                  <Checkbox
                    onClick={this.triggerCheckbox}
                    checked={this.props.data.completed !== null}
                  />
                  <View onClick={this.triggerClick} style={styles.textDisplay}>
                    <Text style={styles.text}>{this.props.data.name}</Text>
                  </View>
                </View>
              </View>
            </div>
            {provided.placeholder}
          </View>
        )}
      </Draggable>
    )
  }
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row'
  },
  textDisplay: {
    flex: 1
  },
  text: {
    fontSize: vars.taskFontSize,
    lineHeight: vars.taskHeight,
    color: vars.taskTextColor
  }
})
const getItemStyle = (isDragging, draggableStyle) => {
  return {
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    paddingLeft: vars.padding / 2,
    paddingRight: vars.padding / 2,
    borderRadius: isDragging ? 3 : 0,

    // change background colour if dragging
    background: isDragging ? vars.dragColor : '',

    // styles we need to apply on draggables
    ...draggableStyle
  }
}

export const Task = withRouter(TaskComponent)
