import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, StyleSheet } from 'react-native'
import { Draggable } from 'react-beautiful-dnd'
import { withRouter } from 'react-router-dom'

import { vars } from '../../styles.js'
import { Link } from '../link.jsx'

class TaskComponent extends React.Component {
  triggerClick = () => {
    const url = `/${this.props.listId}/${this.props.data.id}`
    this.props.history.push(url)
  }
  render() {
    const item = this.props.data
    return (
      <Draggable draggableId={item.id} index={this.props.index}>
        {(provided, snapshot) => (
          <View onClick={this.triggerClick}>
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={getItemStyle(
                snapshot.isDragging,
                provided.draggableProps.style
              )}
            >
              <View>
                <Text style={styles.text}>{this.props.data.name}</Text>
              </View>
            </div>
            {provided.placeholder}
          </View>
        )}
      </Draggable>
    )
  }
}
TaskComponent.propTypes = {
  index: PropTypes.number,
  listId: PropTypes.string,
  data: PropTypes.object
}
const styles = StyleSheet.create({
  text: {
    fontSize: vars.padding,
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
