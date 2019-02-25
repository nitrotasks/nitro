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
import { ShortcutsService } from '../../services/shortcutsService.js'
import { UiService } from '../../services/uiService.js'
import { taskMenu, headerMenu, priorityMenu } from './taskMenu.js'
import { dateValue, deadlineValue, formatDate } from '../../helpers/date.js'
import { formatPriority } from '../../helpers/priority.js'

import { DatepickerActivator } from '../datepickerActivator.jsx'
import { Checkbox } from './checkbox.jsx'

import dateIcon from '../../../assets/icons/material/task-duedate.svg'
import deadlineIcon from '../../../assets/icons/material/task-deadline.svg'
import priorityIcon from '../../../assets/icons/material/task-priority.svg'
import moreIcon from '../../../assets/icons/material/task-more.svg'
import closeIcon from '../../../assets/icons/material/close.svg'

// TODO: Remove Magic Numbers
// But Waka has them, so it's probably okay?
const headerHeight = 112 + 42 + 32
const footerHeight = 36 + 56
const scrollOffset = 96

const ESC_HOTKEY = 'esc'
const CTRLJ_HOTKEY = 'ctrl+j'

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
    TasksExpandedService.bind('focus-name-input', this.focusNameInput)
    ShortcutsService.bind(ESC_HOTKEY, this.triggerHideHotkey)
    ShortcutsService.bind(CTRLJ_HOTKEY, this.triggerHideHotkey)
  }
  componentWillUnmount() {
    NitroSdk.unbind('update', this.taskUpdate)
    TasksExpandedService.unbind('show', this.triggerShow)
    TasksExpandedService.unbind('replace', this.triggerReplace)
    TasksExpandedService.unbind('hide', this.triggerHide)
    TasksExpandedService.unbind('position', this.triggerPosition)
    TasksExpandedService.unbind('focus-name-input', this.focusNameInput)
    ShortcutsService.unbind(ESC_HOTKEY, this.triggerHideHotkey)
    ShortcutsService.unbind(CTRLJ_HOTKEY, this.triggerHideHotkey)
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
      if (this.taskInput.current) this.taskInput.current.focus()
    }
    requestAnimationFrame(() => {
      const scrollLocation = TasksExpandedService.state.position - scrollOffset
      const scrollNode = findNodeHandle(this.notesElement.current)
      const scrollLines = scrollNode
        ? scrollNode.scrollHeight / vars.notesLineHeight
        : 3
      const lineNumber = scrollLines
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
              const expandedHeight =
                headerHeight + footerHeight + lineNumber * vars.notesLineHeight
              const fold = UiService.getScroll() + window.innerHeight

              // If the overlay is "below the fold", we going to scroll down a bit
              if (
                scrollLocation + expandedHeight > fold &&
                expandedHeight < window.innerHeight
              ) {
                UiService.scrollBy({
                  top: scrollLocation + expandedHeight - fold,
                  left: 0,
                  behavior: 'smooth'
                })
              } else if (
                scrollLocation < UiService.getScroll() ||
                expandedHeight >= window.innerHeight
              ) {
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
  triggerHideHotkey = () => {
    if (this.state.hidden === false) {
      TasksExpandedService.triggerBack()
    }
  }
  triggerOverlay = () => {
    TasksExpandedService.triggerBack()
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
        priority: 0,
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
      priority: task.priority,
      checked: task.completed !== null
    }
  }

  triggerChange = field => {
    return e => {
      if (field === 'notes') {
        clearTimeout(this.notesTimeout)
        this.notesTimeout = setTimeout(this.triggerBlur('notes'), 1000)
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
  createOrUpdateTask = (taskId, payload) => {
    if (this.state.mode === 'create') {
      const { list } = TasksExpandedService.state
      payload.list = list
      const task = NitroSdk.addTask(payload)
      TasksExpandedService.state.task = task.id
      TasksExpandedService.triggerReplace(list, task.id)
    } else if (this.state.mode === 'update') {
      NitroSdk.updateTask(taskId, payload)
    }
  }
  triggerBlur = field => {
    return (e, taskId = TasksExpandedService.state.task) => {
      if (
        this.state[field] === null ||
        taskId === null ||
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
  triggerKeyUp = e => {
    if (e.keyCode === 27) {
      e.currentTarget.blur()
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
  triggerPriority = e => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = rect.x + rect.width * 0.5
    const y = rect.y + rect.height * 0.75 - window.scrollY
    const { task } = TasksExpandedService.state
    priorityMenu(task, x, y, 'bottom', 'right')
  }
  triggerMore = e => {
    if (this.state.mode === 'create') {
      this.createOrUpdateTask(TasksExpandedService.state.task, { name: '' })
    }
    const rect = e.currentTarget.getBoundingClientRect()
    const x = rect.x + rect.width * 0.5
    const y = rect.y + rect.height * 0.75 - window.scrollY
    const { task, list } = TasksExpandedService.state
    const viewInList = list === 'today' || list === 'next'
    if (this.state.type === 'task') {
      taskMenu(
        task,
        !viewInList,
        viewInList,
        x,
        y,
        'bottom',
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
      const newValue = prop === 'priority' ? 0 : null
      e.stopPropagation()
      this.createOrUpdateTask(TasksExpandedService.state.task, {
        [prop]: newValue
      })
    }
  }
  triggerPosition = () => {
    this.setState({
      hidden: this.state.hidden
    })
  }
  focusNameInput = () => {
    requestAnimationFrame(() => {
      this.taskInput.current.focus()
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
    const priorityText =
      this.state.priority > 0 ? (
        <React.Fragment>
          <Text style={styles.barText}>
            {formatPriority(this.state.priority)}
          </Text>
          <Image
            accessibilityLabel="Remove Priority"
            title="Remove Priority"
            source={closeIcon}
            resizeMode="contain"
            style={styles.closeIcon}
            onClick={this.triggerRemove('priority')}
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
    const priorityElement = (
      <TouchableOpacity
        key="priority"
        onClick={this.triggerPriority}
        accessible={false}
      >
        <View style={styles.barIconWrapper}>
          <Image
            accessibilityLabel="Choose Priority"
            source={priorityIcon}
            resizeMode="contain"
            style={styles.barIcon}
          />
          {priorityText}
        </View>
      </TouchableOpacity>
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
    if (this.state.priority === 0) {
      rightBar.push(priorityElement)
    } else {
      leftBar.push(priorityElement)
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
              onKeyUp={this.triggerKeyUp}
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
            onKeyUp={this.triggerKeyUp}
          />
          <View style={styles.bar}>
            {leftBar}
            <View style={styles.spacer} />
            {rightBar}
            <TouchableOpacity
              style={styles.moreIcon}
              onClick={this.triggerMore}
              accessible={false}
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
    marginBottom: vars.padding / 2,
    outline: '0'
  },
  bar: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: vars.padding * -0.5
  },
  spacer: {
    flex: 1
  },
  barIconWrapper: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: vars.padding / 2
  },
  moreIcon: {
    paddingLeft: vars.padding / 4,
    paddingRight: vars.padding
  },
  barIcon: {
    opacity: 0.5,
    height: 24 + vars.padding * 1.75,
    width: 24
  },
  barText: {
    fontFamily: vars.fontFamily,
    lineHeight: 18 + vars.padding * 2,
    paddingLeft: vars.padding * 0.25,
    paddingRight: vars.padding * 0.25
  },
  closeIcon: {
    paddingRight: vars.padding,
    height: 18 + vars.padding * 2,
    width: 18,
    opacity: 0.5
  }
})
