import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  Image,
  StyleSheet,
  findNodeHandle,
  TouchableOpacity
} from 'react-native'
import { Draggable } from 'react-beautiful-dnd'

import { NitroSdk } from '../../../nitro.sdk'
import { vars } from '../../styles.js'
import { formatDate, dateValue } from '../../helpers/date.js'
import { TasksExpandedService } from '../../services/tasksExpandedService.js'
import { UiService } from '../../services/uiService.js'
import { Checkbox } from './checkbox.jsx'
import { TaskHeader } from './taskHeader.jsx'
import { taskMenu } from './taskMenu.js'
import { formatPriority } from '../../helpers/priority.js'

import todayIcon from '../../../assets/icons/feather/today.svg'
import notesIcon from '../../../assets/icons/material/note.svg'
import syncIcon from '../../../assets/icons/material/sync.svg'

import priority1Icon from '../../../assets/icons/material/priority-1.svg'
import priority2Icon from '../../../assets/icons/material/priority-2.svg'
import priority3Icon from '../../../assets/icons/material/priority-3.svg'
const priorityIcons = [priority1Icon, priority2Icon, priority3Icon]

export class Task extends React.Component {
  static propTypes = {
    index: PropTypes.number,
    listId: PropTypes.string,
    dataId: PropTypes.string,
    dataName: PropTypes.string,
    dataType: PropTypes.string,
    dataNotes: PropTypes.string,
    dataHeading: PropTypes.string,
    dataDate: PropTypes.instanceOf(Date),
    dataDeadline: PropTypes.instanceOf(Date),
    dataList: PropTypes.string,
    dataCompleted: PropTypes.instanceOf(Date),
    currentHeading: PropTypes.string,
    forceHeadings: PropTypes.bool,
    headersAllowed: PropTypes.bool,
    dragDisabled: PropTypes.bool,
    syncing: PropTypes.bool
  }

  state = {
    hover: false
  }

  viewRef = React.createRef()

  draggingStart = false

  thresholdHit = false

  componentDidMount() {
    // if this task is the selected task, we're going to move the overlay into place
    if (this.props.dataId === TasksExpandedService.state.task) {
      requestAnimationFrame(() => {
        const scrollPos = UiService.getScroll()
        const top = findNodeHandle(this.viewRef.current).getBoundingClientRect()
          .top
        TasksExpandedService.state.position = top + scrollPos
        TasksExpandedService.trigger(
          'show',
          this.props.listId,
          this.props.dataId
        )
      })
    }

    TasksExpandedService.bind('indirect-click', this.indirectClick)
  }

  componentWillUnmount() {
    TasksExpandedService.unbind('indirect-click', this.indirectClick)
  }

  triggerKeyPress = fn => {
    return e => {
      // runs the react-beautiful-dnd events first, if they exist
      if (fn !== null && fn.onKeyDown) {
        fn.onKeyDown(e)
      }
      if (e.defaultPrevented) return

      const keycode = e.keyCode
      if (keycode === 13) {
        const { dataType } = this.props
        if (dataType === 'header' || dataType === 'header-collapsed') {
          e.preventDefault()
          e.currentTarget.querySelector('input').focus()
        } else {
          this.triggerClick()

          // this needs to be better - stuffs up the touchable opacity
          TasksExpandedService.focusNameInput()
        }
      } else if (keycode === 27) {
        e.currentTarget.blur()
      } else if (keycode === 40 || keycode === 74) {
        const node = e.currentTarget.parentNode.nextSibling.children[0]
        if (node) node.focus()
        e.preventDefault()
      } else if (keycode === 38 || keycode === 75) {
        const node = e.currentTarget.parentNode.previousSibling.children[0]
        if (node) node.focus()
        e.preventDefault()
      } else if (keycode === 48 || keycode === 52) {
        // 0 or 4
        const { dataId } = this.props
        NitroSdk.updateTask(dataId, { priority: null })
      } else if (keycode === 49) {
        const { dataId } = this.props
        NitroSdk.updateTask(dataId, { priority: 3 })
      } else if (keycode === 50) {
        const { dataId } = this.props
        NitroSdk.updateTask(dataId, { priority: 2 })
      } else if (keycode === 51) {
        const { dataId } = this.props
        NitroSdk.updateTask(dataId, { priority: 1 })
      } else if (keycode === 67) {
        const { dataId, dataType } = this.props
        if (dataType === 'header' || dataType === 'header-collapsed') return
        NitroSdk.completeTask(dataId)
      } else if (keycode === 84) {
        const { dataId, dataDate, dataType, dataCompleted } = this.props
        if (
          dataCompleted !== null ||
          dataType === 'header' ||
          dataType === 'header-collapsed'
        )
          return
        NitroSdk.updateTask(
          dataId,
          dateValue(
            formatDate(dataDate, dataType, 'today') === 'Today' ? null : 'today'
          )
        )
      }
    }
  }

  triggerKeyUp = e => {
    if (e.defaultPrevented) return
    const keycode = e.keyCode
    if (keycode === 13) {
      const { dataType } = this.props
      if (dataType === 'header' || dataType === 'header-collapsed') {
        e.preventDefault()
        e.currentTarget.querySelector('input').focus()
      }
    }
  }

  triggerClick = () => {
    const { listId, dataId } = this.props
    this.indirectClick(listId, dataId)
  }

  indirectClick = (list, task) => {
    if (task === this.props.dataId) {
      const scrollPos = UiService.getScroll()
      const top = findNodeHandle(this.viewRef.current).getBoundingClientRect()
        .top
      let y = top + scrollPos
      if (TasksExpandedService.state.task === null) {
        TasksExpandedService.triggerTask(list, task, y)
      } else {
        // hacks hack hacks
        const order = UiService.state.currentListTasksOrder
        if (
          order.indexOf(TasksExpandedService.state.task) < order.indexOf(task)
        ) {
          y = y - TasksExpandedService.state.height
        }
        TasksExpandedService.triggerBack()
        setTimeout(() => TasksExpandedService.triggerTask(list, task, y), 350)
      }
    }
  }

  triggerCheckbox = () => {
    const { dataId } = this.props
    NitroSdk.completeTask(dataId)
  }

  triggerContextMenu = e => {
    e.preventDefault()
    const x = e.nativeEvent.pageX
    const y = e.nativeEvent.pageY - window.scrollY
    const viewInList =
      this.props.listId === 'today' || this.props.listId === 'next'
    taskMenu(this.props.dataId, !viewInList, viewInList, x, y, 'top', 'left')
  }

  triggerNoOp = e => {
    const { dataType, headersAllowed } = this.props
    if (
      headersAllowed &&
      (dataType === 'header' || dataType === 'header-collapsed')
    ) {
      // othewise you can't click inside the headers
      return
    }
    e.preventDefault()
  }

  triggerMouseEnter = () => {
    this.setState({ hover: true })
  }

  triggerMouseLeave = () => {
    this.setState({ hover: false })
  }

  render() {
    const props = this.props
    const { hover } = this.state
    let WrapperComponent = TouchableOpacity
    let innerItem
    if (props.dataType === 'header' || props.dataType === 'header-collapsed') {
      WrapperComponent = View
      innerItem = (
        <TaskHeader
          dataId={props.dataId}
          dataName={props.dataName}
          dataType={props.dataType}
          disabled={!props.headersAllowed}
        />
      )
    } else {
      let indicatorsBefore = []
      let indicatorsAfter = null
      let deadlineIndicator = null
      if (props.dataPriority > 0 && props.dataPriority <= 3) {
        indicatorsBefore.push(
          <Image
            key="priority-indicator"
            accessibilityLabel={
              formatPriority(props.dataPriority) + ' Priority'
            }
            source={priorityIcons[props.dataPriority - 1]}
            resizeMode="contain"
            style={styles.priorityIcon}
          />
        )
      }

      if (props.dataDate !== null && props.dataCompleted === null) {
        const date = formatDate(props.dataDate, props.dataType, 'today')
        if (date === 'Today') {
          // don't render anything if it's under one of those headers
          if (
            this.props.listId !== 'today' &&
            this.props.currentHeading !== 'today'
          ) {
            indicatorsBefore.push(
              <Image
                key="today-indicator"
                accessibilityLabel="Do Today"
                source={todayIcon}
                resizeMode="contain"
                style={styles.frontIcon}
              />
            )
          }
        } else if (this.props.currentHeading !== 'overdue') {
          indicatorsBefore.push(
            <View key="date-indicator" style={styles.indicator}>
              <Text style={styles.indicatorText}>{date}</Text>
            </View>
          )
        }
      }
      if (props.dataNotes !== null && props.dataNotes.length > 0) {
        indicatorsAfter = (
          <Image
            accessibilityLabel="Notes"
            source={notesIcon}
            resizeMode="contain"
            style={styles.backIcon}
          />
        )
      }

      let syncIndicator = null
      if (props.syncing) {
        syncIndicator = (
          <Image
            accessibilityLabel="Syncing"
            source={syncIcon}
            resizeMode="contain"
            style={styles.syncIcon}
          />
        )
      }
      if (props.dataDeadline !== null && props.dataCompleted === null) {
        deadlineIndicator = (
          <Text style={styles.subText}>
            {formatDate(props.dataDeadline, props.dataType, 'deadline')}
          </Text>
        )
      }
      let listIndicators = []
      const heading = props.currentHeading.split('-')
      if (
        ['today', 'next'].indexOf(props.listId) > -1 &&
        heading.length === 1 &&
        props.dataList !== 'inbox' &&
        props.dataList !== heading[0]
      ) {
        listIndicators.push(
          <Text key="list-indicator" style={styles.subText}>
            {deadlineIndicator || listIndicators.length > 0 ? ' · ' : ''}
            {NitroSdk.getList(props.dataList).name}
          </Text>
        )
      }
      if (props.dataHeading && heading.length === 1) {
        listIndicators.push(
          <Text key="heading-indicator" style={styles.subText}>
            {deadlineIndicator || listIndicators.length > 0 ? ' · ' : ''}
            {props.dataHeading}
          </Text>
        )
      }

      // if the bottom row isn't empty, we apply our padded out styles
      let checkboxWrapperStyles = styles.checkboxWrapper,
        textDisplayStyles = styles.textDisplay
      if (deadlineIndicator || listIndicators.length > 0) {
        checkboxWrapperStyles = [
          styles.checkboxWrapper,
          styles.checkboxWrapperPadding
        ]
        textDisplayStyles = [styles.textDisplay, styles.textDisplayPadding]
      }
      innerItem = (
        <View style={styles.wrapper} onContextMenu={this.triggerContextMenu}>
          <View style={checkboxWrapperStyles}>
            <Checkbox
              onClick={this.triggerCheckbox}
              checked={props.dataCompleted !== null}
            />
          </View>
          <TouchableOpacity
            onClick={this.triggerClick}
            accessible={false}
            style={textDisplayStyles}
          >
            <Fragment>
              {indicatorsBefore}
              <View style={styles.textRow}>
                <View style={styles.textWrapper}>
                  <Text numberOfLines={1} style={styles.text}>
                    {props.dataName}
                  </Text>
                  {indicatorsAfter}
                  {syncIndicator}
                </View>
                <View style={styles.subTextRow}>
                  {deadlineIndicator}
                  {listIndicators}
                </View>
              </View>
            </Fragment>
          </TouchableOpacity>
        </View>
      )
    }

    return (
      <Draggable
        draggableId={'tasks-' + props.dataId}
        index={props.index}
        isDragDisabled={props.dragDisabled}
      >
        {(provided, snapshot) => {
          return (
            <WrapperComponent
              ref={this.viewRef}
              style={
                props.dataType === 'task' && hover
                  ? [styles.transitionStyle, styles.hover]
                  : styles.transitionStyle
              }
              onMouseEnter={this.triggerMouseEnter}
              onMouseLeave={this.triggerMouseLeave}
              accessible={false}
            >
              <div
                onMouseDown={this.triggerNoOp}
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={getItemStyle(
                  snapshot.isDragging,
                  provided.draggableProps.style
                )}
                className="list-item-focus"
                tabIndex="0"
                onKeyDown={this.triggerKeyPress(provided.dragHandleProps)}
                onKeyUp={this.triggerKeyUp}
              >
                {innerItem}
              </div>
            </WrapperComponent>
          )
        }}
      </Draggable>
    )
  }
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    cursor: 'default'
  },
  hover: {
    borderRadius: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.025)'
  },
  checkboxWrapper: {
    paddingLeft: vars.padding / 4,
    paddingTop: vars.padding * 0.1875,
    paddingBottom: vars.padding * 0.1875
  },
  checkboxWrapperPadding: {
    paddingTop: vars.padding * 0.4375,
    paddingBottom: vars.padding * 0.5625
  },
  textDisplay: {
    cursor: 'default',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: vars.padding / 4,
    paddingRight: vars.padding / 2
  },
  textDisplayPadding: {
    paddingTop: vars.padding * 0.25,
    paddingBottom: vars.padding * 0.375
  },
  textRow: {
    flex: 1
  },
  frontIcon: {
    width: 24,
    height: 24,
    marginRight: vars.padding * 0.375
  },
  priorityIcon: {
    width: 18,
    height: 18,
    marginRight: vars.padding * 0.25
  },
  backIcon: {
    width: 18,
    height: 22,
    marginLeft: vars.padding * 0.375,
    marginRight: vars.padding / 4
  },
  syncIcon: {
    width: 24,
    height: 24,
    marginRight: vars.padding / 4
  },
  text: {
    fontFamily: vars.fontFamily,
    fontSize: vars.taskFontSize,
    lineHeight: 24,
    color: vars.taskTextColor,
    userSelect: 'none'
  },
  textWrapper: {
    flex: 1,
    flexDirection: 'row'
  },
  indicator: {
    paddingLeft: vars.padding / 4,
    paddingRight: vars.padding / 4,
    paddingTop: vars.padding / 4,
    paddingBottom: vars.padding / 4,
    backgroundColor: vars.indicatorColor,
    marginRight: vars.padding * 0.5,
    borderRadius: 3
  },
  indicatorText: {
    fontFamily: vars.fontFamily,
    fontSize: vars.taskFontSize - 3,
    fontWeight: '600',
    color: 'rgba(0,0,0,0.6)'
  },
  transitionStyle: {
    cursor: 'default',
    userSelect: 'none',
    transitionDuration: '300ms',
    transitionTimingFunction: 'ease',
    transitionProperty: 'transform'
  },
  subTextRow: {
    flex: 1,
    flexDirection: 'row'
  },
  subText: {
    fontFamily: vars.fontFamily,
    fontSize: vars.taskFontSize - 3,
    color: vars.taskSubtextColor
  }
})
const getItemStyle = (isDragging, draggableStyle) => {
  const style = {
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    borderRadius: 3,

    // change background colour if dragging
    backgroundColor: isDragging ? vars.dragColor : 'transparent',

    // styles we need to apply on draggables
    ...draggableStyle
  }
  return style
}
