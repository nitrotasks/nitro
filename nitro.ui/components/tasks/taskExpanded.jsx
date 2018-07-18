import React from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  findNodeHandle
} from 'react-native'

import { NitroSdk } from '../../../nitro.sdk'
import { vars } from '../../styles.js'
import { TasksExpandedService } from '../../services/tasksExpandedService.js'
import { taskMenu, headerMenu } from './taskMenu.js'
import { dateValue, deadlineValue, formatDate } from '../../helpers/date.js'

import { Datepicker } from '../datepicker.jsx'
import { DatepickerActivator } from '../datepickerActivator.jsx'
import { Checkbox } from './checkbox.jsx'

import dateIcon from '../../../assets/icons/material/task-duedate.svg'
import deadlineIcon from '../../../assets/icons/material/task-deadline.svg'
import moreIcon from '../../../assets/icons/material/task-more.svg'
import closeIcon from '../../../assets/icons/material/close.svg'

export class TaskExpanded extends React.Component {
  static propTypes = {
    triggerBack: PropTypes.func
  }
  constructor(props) {
    super(props)
    this.notesElement = React.createRef()
    this.notesTimeout = 0

    if (TasksExpandedService.state.task !== null) {
      const taskDetails = this.getTask(TasksExpandedService.state.task)
      this.state = {
        ...taskDetails,
        hidden: false,
        lineNumber: 3
      }
    } else {
      this.state = {
        name: '',
        notes: '',
        type: 'task',
        date: null,
        checked: false,
        hidden: true,
        overlayHidden: true,
        lineNumber: 3
      }
    }
  }
  componentDidMount() {
    NitroSdk.bind('update', this.taskUpdate)
    TasksExpandedService.bind('show', this.triggerShow)
    TasksExpandedService.bind('hide', this.triggerHide)
  }
  componentWillUnmount() {
    NitroSdk.unbind('update', this.taskUpdate)
    TasksExpandedService.unbind('show', this.triggerShow)
    TasksExpandedService.unbind('hide', this.triggerHide)
  }
  taskUpdate = (type, listId, taskId) => {
    if (type === 'tasks' && taskId === TasksExpandedService.state.task) {
      const taskDetails = this.getTask(taskId)
      requestAnimationFrame(() => {
        this.setState(taskDetails)
      })
    }
  }
  triggerShow = (list, task) => {
    const taskDetails = this.getTask(task)
    this.setState({
      ...taskDetails,
      lineNumber: 3
    })
    requestAnimationFrame(() => {
      document.body.style.overflowY = 'hidden'
      const scrollLocation = TasksExpandedService.state.position - 96
      requestAnimationFrame(() => {
        window.scrollTo({ top: scrollLocation, left: 0, behavior: 'smooth' })
      })
      const lineNumber =
        findNodeHandle(this.notesElement.current).scrollHeight /
        vars.notesLineHeight
      TasksExpandedService.triggerTaskHeight(lineNumber)
      this.setState({
        hidden: false,
        overlayHidden: false,
        lineNumber: lineNumber
      })
    })
  }
  triggerHide = () => {
    setTimeout(() => {
      requestAnimationFrame(() => {
        document.body.style.overflowY = ''
      })
      this.setState({
        overlayHidden: true
      })
    }, 300)
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
      type: task.type,
      notes: task.notes,
      date: task.date,
      deadline: task.deadline,
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
      if (field === 'notes') {
        clearTimeout(this.notesTimeout)
        this.notesTimeout = setTimeout(this.saveNotes, 1000)
        const lineNumber = e.currentTarget.scrollHeight / vars.notesLineHeight
        if (this.state.lineNumber !== lineNumber) {
          TasksExpandedService.triggerTaskHeight(lineNumber)
          this.setState({
            lineNumber: lineNumber,
            [field]: e.currentTarget.value
          })
          return
        }
      }
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
  saveNotes = () => {
    NitroSdk.updateTask(TasksExpandedService.state.task, {
      notes: this.state.notes
    })
  }
  updateProp = field => {
    return value => {
      let data = { [field]: value }
      if (field === 'date') {
        data = dateValue(value)
      } else if (field === 'deadline') {
        data = deadlineValue(value)
      }
      NitroSdk.updateTask(TasksExpandedService.state.task, data)
    }
  }
  triggerChecked = () => {
    // temporary! this component needs some smarts on how to trigger updates.
    this.setState({
      checked: !this.state.checked
    })

    NitroSdk.completeTask(TasksExpandedService.state.task)
  }
  triggerMore = e => {
    const x = e.nativeEvent.pageX
    const y = e.nativeEvent.pageY - window.scrollY
    if (this.state.type === 'task') {
      taskMenu(
        TasksExpandedService.state.task,
        true,
        x,
        y,
        'top',
        'right',
        this.triggerOverlay
      )
    } else if (this.state.type === 'header') {
      headerMenu(
        TasksExpandedService.state.task,
        x,
        y,
        'top',
        'right',
        this.triggerOverlay
      )
    }
  }
  triggerRemove = prop => {
    return (e) => {
      e.stopPropagation()
      NitroSdk.updateTask(TasksExpandedService.state.task, {
        [prop]: null
      })
    }
  }
  render() {
    const top = TasksExpandedService.state.position + vars.padding
    const overlayTop = window.scrollY
    let opacity = 1
    let overlayOpacity = 0.5
    const overlayDisplay = this.state.overlayHidden ? '100vh' : '200vh'
    let transform = [{ translateY: 0 }]
    let pointerEvents = 'auto'
    if (this.state.hidden) {
      opacity = 0
      overlayOpacity = 0      
      pointerEvents = 'none'
      transform = [{ translateY: -2 * vars.padding }]
    }

    const leftBar = []
    const rightBar = []
    const dateText = this.state.date ? (
      <React.Fragment>
        <Text style={styles.barText}>{formatDate(this.state.date)}</Text>
        <Image 
          accessibilityLabel="Remove Date"
          title="Remove Date"
          source={closeIcon}
          resizeMode="contain"
          style={styles.closeIcon}
          onClick={this.triggerRemove('date')}
        />
      </React.Fragment>
    ) : null
    const deadlineText = this.state.deadline ? (
      <React.Fragment>
        <Text style={styles.barText}>{formatDate(this.state.deadline)}</Text>
        <Image 
          accessibilityLabel="Remove Deadline"
          title="Remove Deadline"
          source={closeIcon}
          resizeMode="contain"
          style={styles.closeIcon}
          onClick={this.triggerRemove('deadline')}
        />
      </React.Fragment>
    ) : null
    const dateElement = (
      <DatepickerActivator
        pickerId="expanded"
        pickerType="date"
        key="date"
        date={this.state.date}
        onSelect={this.updateProp('date')}
      >
        <View style={styles.barIconWrapper}>
          <Image
            accessibilityLabel="Choose Date"
            source={dateIcon}
            resizeMode="contain"
            style={styles.barIcon}
          />
          {dateText}
        </View>
      </DatepickerActivator>
    )
    const deadlineElement = (
      <DatepickerActivator
        key="deadline"
        pickerId="expanded"
        pickerType="deadline"
        date={this.state.deadline}
        onSelect={this.updateProp('deadline')}
      >
        <View style={styles.barIconWrapper}>
          <Image
            accessibilityLabel="Choose Deadline"
            source={deadlineIcon}
            resizeMode="contain"
            style={styles.barIcon}
          />
          {deadlineText}
        </View>
      </DatepickerActivator>
    )
    if (this.state.date === null) {
      rightBar.push(dateElement)
    } else {
      leftBar.push(dateElement)
    }
    if (this.state.deadline === null) {
      rightBar.push(deadlineElement)
    } else {
      leftBar.push(deadlineElement)
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
            ref={this.notesElement}
            style={styles.notes}
            value={this.state.notes || ''}
            placeholder="Notes"
            multiline={true}
            numberOfLines={this.state.lineNumber}
            onChange={this.triggerChange('notes')}
            onBlur={this.triggerBlur('notes')}
          />
          <View style={styles.bar}>
            {leftBar}
            <View style={styles.spacer} />
            {rightBar}
            <TouchableOpacity
              style={styles.moreIcon}
              onClick={this.triggerMore}
            >
              <Image
                accessibilityLabel="Choose Deadline"
                source={moreIcon}
                resizeMode="contain"
                style={styles.barIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
        <Datepicker pickerId="expanded" position="sheet" />
        <View
          pointerEvents={pointerEvents}
          style={[
            styles.overlay,
            {
              opacity: overlayOpacity,
              top: overlayTop,
              height: overlayDisplay
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
    height: '200vh',
    backgroundColor: '#fff',
    opacity: 0.5,
    transitionDuration: '300ms',
    transitionTimingFunction: 'ease',
    transitionProperty: 'opacity',
    touchAction: 'none'
  },
  wrapper: {
    position: 'absolute',
    zIndex: 11,
    left: 0,
    width: '100%',
    backgroundColor: '#fff',
    // bottom and right padding is ommited for large touch targets
    paddingTop: vars.padding,
    paddingLeft: vars.padding,
    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
    transitionDuration: '300ms, 300ms',
    transitionTimingFunction: 'ease, ease',
    transitionProperty: 'opacity, transform'
  },
  topRow: {
    flex: 1,
    flexDirection: 'row',
    paddingRight: vars.padding
  },
  header: {
    fontFamily: vars.fontFamily,
    fontSize: vars.taskExpandedFontSize,
    outline: '0',
    flex: 1
  },
  notes: {
    fontFamily: vars.fontFamily,
    fontSize: vars.taskFontSize,
    lineHeight: vars.notesLineHeight,
    marginTop: vars.padding,
    paddingRight: vars.padding,
    outline: '0'
  },
  bar: {
    flex: 1,
    flexDirection: 'row'
  },
  spacer: {
    flex: 1
  },
  barIconWrapper: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: vars.padding,
    paddingBottom: vars.padding,
    paddingLeft: vars.padding / 4,
    paddingRight: vars.padding / 4
  },
  moreIcon: {
    paddingTop: vars.padding,
    paddingRight: vars.padding
  },
  barIcon: {
    opacity: 0.5,
    height: 24,
    width: 24
  },
  barText: {
    fontFamily: vars.fontFamily,
    lineHeight: 24,
    paddingLeft: vars.padding * 0.25,
    paddingRight: vars.padding * 0.25
  },
  closeIcon: {
    marginTop: 3,
    marginRight: vars.padding / 2,
    height: 18,
    width: 18,
    opacity: 0.5
  }
})
