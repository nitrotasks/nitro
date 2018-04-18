import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, TextInput, StyleSheet } from 'react-native'

import { NitroSdk } from '../../../nitro.sdk'
import { vars } from '../../styles.js'
import { TasksExpandedService } from '../../services/tasksExpandedService.js'

import { Checkbox } from './checkbox.jsx'

export class TaskExpanded extends React.Component {
  static propTypes = {
    triggerBack: PropTypes.func
  }
  constructor(props) {
    super(props)
    this.wrapper = React.createRef()

    if (TasksExpandedService.state.task !== null) {
      const taskDetails = this.getTask(TasksExpandedService.state.task)
      this.state = {
        ...taskDetails,
        hidden: false
      }
    } else {
      this.state = {
        name: '',
        notes: '',
        checked: false,
        hidden: true
      }
    }
  }
  componentDidMount() {
    TasksExpandedService.bind('show', this.triggerShow)
    TasksExpandedService.bind('hide', this.triggerHide)
  }
  componentWillUnmount() {
    TasksExpandedService.unbind('show', this.triggerShow)
    TasksExpandedService.unbind('hide', this.triggerHide)
  }
  triggerShow = (list, task) => {
    const taskDetails = this.getTask(task)
    requestAnimationFrame(() => {
      this.setState({
        ...taskDetails,
        hidden: false
      })
    })
  }
  triggerHide = list => {
    requestAnimationFrame(() => {
      this.setState({
        hidden: true
      })
    })
  }
  getTask = taskId => {
    const task = NitroSdk.getTask(taskId)
    return {
      name: task.name,
      notes: task.notes,
      checked: task.completed !== null
    }
  }
  triggerOverlay = () => {
    if (window.location.pathname.split('/').length > 2) {
      this.props.triggerBack()
    }
  }
  triggerChange = field => {
    return e => {
      this.setState({
        [field]: e.currentTarget.value
      })
    }
  }
  triggerBlur = field => {
    return e => {
      NitroSdk.updateTask(TasksExpandedService.state.task, {
        [field]: this.state[field]
      })
    }
  }
  triggerChecked = () => {
    // temporary! this component needs some smarts on how to trigger updates.
    this.setState({
      checked: !this.state.checked
    })

    NitroSdk.completeTask(TasksExpandedService.state.task)
  }
  render() {
    const top = TasksExpandedService.state.position
    let opacity = 1
    let overlayOpacity = 0.5
    let transform = [{ translateY: 0 }]
    let pointerEvents = 'auto'
    if (this.state.hidden) {
      opacity = 0
      overlayOpacity = 0
      pointerEvents = 'none'
      transform = [{ translateY: -2 * vars.padding }]
    }
    return (
      <React.Fragment>
        <View
          pointerEvents={pointerEvents}
          style={[
            styles.wrapper,
            {
              top: top,
              opacity: opacity,
              transform: transform
            }
          ]}
          ref={this.wrapper}
        >
          <View style={styles.topRow}>
            <Checkbox
              checked={this.state.checked}
              onClick={this.triggerChecked}
            />
            <TextInput
              style={styles.header}
              value={this.state.name}
              placeholder="Task Name"
              onChange={this.triggerChange('name')}
              onBlur={this.triggerBlur('name')}
            />
          </View>
          <TextInput
            style={styles.notes}
            value={this.state.notes || ''}
            placeholder="Notes"
            multiline={true}
            numberOfLines={3}
            onChange={this.triggerChange('notes')}
            onBlur={this.triggerBlur('notes')}
          />
        </View>
        <View
          pointerEvents={pointerEvents}
          style={[
            styles.overlay,
            {
              opacity: overlayOpacity
            }
          ]}
          onClick={this.triggerOverlay}
        />
      </React.Fragment>
    )
  }
}
const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    zIndex: 10,
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    backgroundColor: '#fff',
    opacity: 0.5,
    transitionDuration: '200ms',
    transitionTimingFunction: 'ease',
    transitionProperty: 'opacity'
  },
  wrapper: {
    position: 'absolute',
    zIndex: 11,
    left: 0,
    width: '100%',
    backgroundColor: '#fff',
    padding: vars.padding,
    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
    transitionDuration: '300ms, 300ms',
    transitionTimingFunction: 'ease, ease',
    transitionProperty: 'opacity, transform'
  },
  topRow: {
    flex: 1,
    flexDirection: 'row'
  },
  header: {
    fontSize: vars.taskExpandedFontSize,
    outline: '0'
  },
  notes: {
    fontSize: vars.taskFontSize,
    paddingTop: vars.padding,
    outline: '0'
  }
})
