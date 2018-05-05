import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, StyleSheet } from 'react-native'
import { Draggable } from 'react-beautiful-dnd'
import { withRouter } from 'react-router-dom'

import { NitroSdk } from '../../../nitro.sdk'
import { vars } from '../../styles.js'
import { TasksExpandedService } from '../../services/tasksExpandedService.js'
import { Checkbox } from './checkbox.jsx'

export class Task extends React.Component {
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
      // TODO: this should be the same as pageY, but on iOS it's broken
      // so using this manual calculation for now
      const scrollby = y + 171
      // console.log(scrollby === pageY)
      TasksExpandedService.triggerTask(
        this.props.listId,
        this.props.data.id,
        scrollby
      )
    })
  }
  triggerCheckbox = e => {
    NitroSdk.completeTask(this.props.data.id)
  }
  render() {
    const item = this.props.data
    return (
      <Draggable draggableId={item.id} index={this.props.index}>
        {(provided, snapshot) => (
          <View ref={this.viewRef} style={styles.transitionStyle}>
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={getItemStyle(
                snapshot.isDragging,
                provided.draggableProps.style
              )}
            >
              <View style={styles.wrapper}>
                <Checkbox
                  onClick={this.triggerCheckbox}
                  checked={this.props.data.completed !== null}
                />
                <View onClick={this.triggerClick} style={styles.textDisplay}>
                  <Text style={styles.text}>{this.props.data.name}</Text>
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
    fontFamily: vars.fontFamily,
    fontSize: vars.taskFontSize,
    marginTop: 9,
    marginBottom: 9,
    lineHeight: 24,
    color: vars.taskTextColor
  },
  transitionStyle: {
    transitionDuration: '300ms',
    transitionTimingFunction: 'ease',
    transitionProperty: 'transform'
  }
})
const getItemStyle = (isDragging, draggableStyle) => {
  const style = {
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
  return style
}
