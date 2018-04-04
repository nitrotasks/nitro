import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, StyleSheet } from 'react-native'
import { Draggable } from 'react-beautiful-dnd'

import { vars } from '../../styles.js'
import { Link } from '../link.jsx'

export class Task extends React.Component {
  render() {
    const link = `/${this.props.listId}/${this.props.data.id}`
    const item = this.props.data
    return (
      <Draggable draggableId={item.id} index={this.props.index}>
        {(provided, snapshot) => (
          <div>
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={getItemStyle(
                snapshot.isDragging,
                provided.draggableProps.style
              )}
            >
              <div>
                {this.props.data.id}:{this.props.data.name}
              </div>
            </div>
            {provided.placeholder}
          </div>
        )}
      </Draggable>
    )
  }
}
// <Link to={link}>
//                 <Text style={styles.text}>{this.props.data.name}</Text>
//               </Link>
Task.propTypes = {
  index: PropTypes.number,
  listId: PropTypes.string,
  data: PropTypes.object
}
const styles = StyleSheet.create({
  text: {
    fontSize: vars.padding * 1.125,
    lineHeight: vars.taskHeight,
    color: vars.taskTextColor
  }
})
const getItemStyle = (isDragging, draggableStyle) => {
  // console.log(isDragging, draggableStyle.top, draggableStyle)
  // if (draggableStyle.top && draggableStyle.transform !== null) {
  //   draggableStyle.top = draggableStyle.top - vars.materialHeaderHeight
  // }
  return {
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: vars.padding,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle
  }
}
