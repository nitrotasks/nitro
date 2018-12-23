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
import { UiService } from '../../services/uiService.js'
import { taskMenu, headerMenu } from './taskMenu.js'
import { dateValue, deadlineValue, formatDate } from '../../helpers/date.js'

import { DatepickerActivator } from '../datepickerActivator.jsx'
import { Checkbox } from './checkbox.jsx'

import dateIcon from '../../../assets/icons/material/task-duedate.svg'
import deadlineIcon from '../../../assets/icons/material/task-deadline.svg'
import moreIcon from '../../../assets/icons/material/task-more.svg'
import closeIcon from '../../../assets/icons/material/close.svg'

// TODO: Remove Magic Numbers
// But Waka has them, so it's probably okay?
const headerHeight = 112 + 42 + 32
const footerHeight = 36 + 56
const scrollOffset = 96

const getMaxLines = () =>
  Math.floor(
    (document.documentElement.clientHeight - headerHeight - footerHeight) /
      vars.notesLineHeight
  )

export class TaskExpanded extends React.Component {
  static propTypes = {
    listId: PropTypes.string
  }
  constructor(props) {
    super(props)
    this.taskInput = React.createRef()
    this.notesElement = React.createRef()
    this.notesTimeout = 0
    this.positionTimeout = 0
    this.previousListId = TasksExpandedService.state.list

    if (TasksExpandedService.state.task !== null) {
      const taskDetails = this.getTask(TasksExpandedService.state.task)
      this.state = {
        ...taskDetails,
        hidden: false,
        lineNumber: 3
      }
      requestAnimationFrame(() => UiService.setCardPosition('hidden'))
    } else {
      this.state = {
        mode: 'create',
        name: '',
        notes: '',
        type: 'task',
        date: null,
        checked: false,
        hidden: true,
        lineNumber: 3
      }
    }
  }
  componentDidMount() {
    NitroSdk.bind('update', this.taskUpdate)
    TasksExpandedService.bind('show', this.triggerShow)
    TasksExpandedService.bind('replace', this.triggerReplace)
    TasksExpandedService.bind('hide', this.triggerHide)
    TasksExpandedService.bind('position', this.triggerPosition)
  }
  componentWillUnmount() {
    NitroSdk.unbind('update', this.taskUpdate)
    TasksExpandedService.unbind('show', this.triggerShow)
    TasksExpandedService.unbind('replace', this.triggerReplace)
    TasksExpandedService.unbind('hide', this.triggerHide)
    TasksExpandedService.unbind('position', this.triggerPosition)
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
    if (taskDetails.mode === 'create') {
      this.taskInput.current.focus()
    }
    requestAnimationFrame(() => {
      const scrollLocation = TasksExpandedService.state.position - scrollOffset
      const scrollNode = findNodeHandle(this.notesElement.current)
      const scrollLines = scrollNode
        ? scrollNode.scrollHeight / vars.notesLineHeight
        : 3
      const lineNumber = Math.min(getMaxLines(), scrollLines)
      TasksExpandedService.triggerTaskHeight(lineNumber)

      this.setState(
        {
          hidden: false,
          lineNumber: lineNumber
        },
        () => {
          requestAnimationFrame(() => {
            if (window.innerWidth <= 850) {
              // mobile
              UiService.setCardPosition('hidden')
              UiService.scrollTo({
                top: scrollLocation,
                left: 0,
                behavior: 'smooth'
              })
            } else {
              // desktop
              // Maybe Intersection Observer is more suited towards this
              const expandedHeight =
                headerHeight + footerHeight + lineNumber * vars.notesLineHeight
              const fold = UiService.getScroll() + window.innerHeight

              // If the overlay is "below the fold", we going to scroll down a bit
              if (scrollLocation + expandedHeight > fold) {
                UiService.scrollBy({
                  top: scrollLocation + expandedHeight - fold,
                  left: 0,
                  behavior: 'smooth'
                })
              } else if (scrollLocation < UiService.getScroll()) {
                UiService.scrollTo({
                  top: scrollLocation,
                  left: 0,
                  behavior: 'smooth'
                })
              }
            }
          })
        }
      )
    })
  }
  triggerReplace = (list, task) => {
    // this is just a soft replace
    const taskDetails = this.getTask(task)
    this.setState(taskDetails)
  }
  triggerHide = (list, oldTask) => {
    // TODO: this is a bit of a hack
    requestAnimationFrame(() => {
      this.triggerBlur('notes')(null, oldTask)
      clearTimeout(this.notesTimeout)

      UiService.setCardPosition('map')
      this.setState({
        hidden: true
      })
    })
  }
  getTask = taskId => {
    if (taskId === 'new') {
      return {
        mode: 'create',
        name: '',
        type: 'task',
        notes: '',
        date: null,
        deadline: null,
        checked: false
      }
    }
    const task = NitroSdk.getTask(taskId)
    return {
      mode: 'update',
      name: task.name,
      type: task.type,
      notes: task.notes,
      date: task.date,
      deadline: task.deadline,
      checked: task.completed !== null
    }
  }
  triggerOverlay = () => {
    TasksExpandedService.triggerBack()
  }
  triggerChange = field => {
    return e => {
      if (field === 'notes') {
        clearTimeout(this.notesTimeout)
        this.notesTimeout = setTimeout(this.triggerBlur('notes'), 1000)
        const lineNumber = Math.min(
          getMaxLines(),
          e.currentTarget.scrollHeight / vars.notesLineHeight
        )
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
  createOrUpdateTask = (taskId, payload) => {
    if (this.state.mode === 'create') {
      payload.list = TasksExpandedService.state.list
      const task = NitroSdk.addTask(payload)
      TasksExpandedService.triggerReplace(
        TasksExpandedService.state.list,
        task.id
      )
    } else if (this.state.mode === 'update') {
      NitroSdk.updateTask(taskId, payload)
    }
  }
  triggerBlur = field => {
    return (e, taskId = TasksExpandedService.state.task) => {
      if (
        this.state[field] === null ||
        (this.state.mode === 'create' && this.state[field] === '') ||
        (field === 'name' && this.state[field] === '') ||
        (this.state.mode !== 'create' &&
          NitroSdk.getTask(taskId)[field] === this.state[field])
      ) {
        return
      }
      this.createOrUpdateTask(taskId, {
        [field]: this.state[field]
      })
    }
  }
  updateProp = field => {
    return value => {
      let data = { [field]: value }
      if (field === 'date') {
        data = dateValue(value)
      } else if (field === 'deadline') {
        data = deadlineValue(value)
      }
      this.createOrUpdateTask(TasksExpandedService.state.task, data)
    }
  }
  triggerChecked = () => {
    // TODO: this component needs some smarts on how to trigger updates.
    this.setState({
      checked: !this.state.checked
    })

    if (this.state.mode === 'create') {
      this.createOrUpdateTask(TasksExpandedService.state.task, { name: '' })
    }
    NitroSdk.completeTask(TasksExpandedService.state.task)
  }
  triggerMore = e => {
    if (this.state.mode === 'create') {
      this.createOrUpdateTask(TasksExpandedService.state.task, { name: '' })
    }
    const x = e.nativeEvent.pageX
    const y = e.nativeEvent.pageY - window.scrollY
    const { task, list } = TasksExpandedService.state
    const viewInList = list === 'today' || list === 'next'
    if (this.state.type === 'task') {
      taskMenu(
        task,
        !viewInList,
        viewInList,
        x,
        y,
        'top',
        'right',
        this.triggerOverlay
      )
    } else if (
      this.state.type === 'header' ||
      this.state.type === 'header-collapsed'
    ) {
      headerMenu(task, x, y, 'top', 'right', this.triggerOverlay)
    }
  }
  triggerRemove = prop => {
    return e => {
      e.stopPropagation()
      this.createOrUpdateTask(TasksExpandedService.state.task, {
        [prop]: null
      })
    }
  }
  triggerPosition = () => {
    this.setState({
      hidden: this.state.hidden
    })
  }
  render() {
    const { listId } = this.props
    let top = TasksExpandedService.state.position + vars.padding

    // if the list changes
    if (this.previousListId !== listId && this.state.hidden) {
      this.previousListId = listId
      return null
    }

    let opacity = 1
    let transform = [{ translateY: 0 }]
    let pointerEvents = 'auto'
    if (this.state.hidden) {
      opacity = 0
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
          className="desktop-90 desktop-expanded"
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
              value={this.state.name || ''}
              placeholder="Task Name"
              onChange={this.triggerChange('name')}
              onBlur={this.triggerBlur('name')}
              ref={this.taskInput}
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
                accessibilityLabel="More"
                source={moreIcon}
                resizeMode="contain"
                style={styles.barIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </React.Fragment>
    )
  }
}
const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    zIndex: 11,
    left: 0,
    width: '100%',
    backgroundColor: '#fff',
    // bottom and right padding is ommited for large touch targets
    paddingTop: vars.padding,
    paddingLeft: vars.padding * 0.75,
    boxShadow: '0 1px 15px rgba(0,0,0,0.1)',
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
    flex: 1,
    paddingLeft: vars.padding / 4
  },
  notes: {
    fontFamily: vars.fontFamily,
    fontSize: vars.taskFontSize,
    lineHeight: vars.notesLineHeight,
    marginTop: vars.padding,
    paddingLeft: vars.padding * 0.375,
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
