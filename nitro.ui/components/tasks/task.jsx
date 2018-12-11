import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, Image, StyleSheet, findNodeHandle } from 'react-native'
import { Draggable } from 'react-beautiful-dnd'

import { NitroSdk } from '../../../nitro.sdk'
import { vars } from '../../styles.js'
import { formatDate } from '../../helpers/date.js'
import { TasksExpandedService } from '../../services/tasksExpandedService.js'
import { UiService } from '../../services/uiService.js'
import { Checkbox } from './checkbox.jsx'
import { TaskHeader } from './taskHeader.jsx'
import { taskMenu } from './taskMenu.js'

import todayIcon from '../../../assets/icons/feather/today.svg'
import notesIcon from '../../../assets/icons/material/note.svg'
import syncIcon from '../../../assets/icons/material/sync.svg'

// 0.15 is the threshold defined in react-beautiful-dnd
// we'll go a bit higher
const forcePressTheshold = 0.25

export class Task extends React.PureComponent {
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
    headersAllowed: PropTypes.bool,
    dragDisabled: PropTypes.bool,
    syncing: PropTypes.bool
  }

  viewRef = React.createRef()
  draggingStart = false
  thresholdHit = false

  componentDidMount() {
    if ('ontouchforcechange' in document === true) {
      findNodeHandle(this.viewRef.current).addEventListener(
        'touchforcechange',
        this.triggerForcePress
      )
    }

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
  // iOS has a funnny force press / 3d touch API
  // i.e it doesn't use pointer events
  // and raises these events at same time
  triggerForcePress = e => {
    const force = e.changedTouches[0].force
    if (
      this.draggingStart === true &&
      this.thresholdHit === false &&
      e.defaultPrevented === false &&
      force > forcePressTheshold
    ) {
      this.thresholdHit = true
      e.preventDefault()

      requestAnimationFrame(() => {
        this.triggerClick()
      })
      setTimeout(() => {
        this.thresholdHit = false
      }, 300)
    }
  }
  triggerCheckbox = () => {
    NitroSdk.completeTask(this.props.dataId)
  }
  triggerContextMenu = e => {
    e.preventDefault()
    const x = e.nativeEvent.pageX
    const y = e.nativeEvent.pageY - window.scrollY
    taskMenu(this.props.dataId, true, x, y, 'top', 'left')
  }
  render() {
    const props = this.props
    let innerItem
    if (props.dataType === 'header' || props.dataType === 'header-collapsed') {
      innerItem = (
        <TaskHeader
          dataId={props.dataId}
          dataName={props.dataName}
          dataType={props.dataType}
          disabled={!props.headersAllowed}
        />
      )
    } else {
      let indicatorsBefore = null
      let indicatorsAfter = null
      let deadlineIndicator = null
      if (props.dataDate !== null && props.dataCompleted === null) {
        const date = formatDate(props.dataDate, props.dataType, 'today')
        if (date === 'Today') {
          // don't render anything if it's under one of those headers
          if (
            this.props.listId !== 'today' &&
            this.props.currentHeading !== 'today'
          ) {
            indicatorsBefore = (
              <Image
                accessibilityLabel="Do Today"
                source={todayIcon}
                resizeMode="contain"
                style={styles.frontIcon}
              />
            )
          }
        } else if (this.props.currentHeading !== 'overdue') {
          indicatorsBefore = (
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
      if (['today', 'next'].indexOf(props.listId) > -1) {
        const heading = props.currentHeading.split('-')
        if (
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
      }

      // if the bottom row isn't empty, we apply our padded out styles
      const wrapperStyles =
        deadlineIndicator || listIndicators.length > 0
          ? [styles.wrapper, styles.wrapperPadding]
          : styles.wrapper
      innerItem = (
        <View style={wrapperStyles} onContextMenu={this.triggerContextMenu}>
          <Checkbox
            onClick={this.triggerCheckbox}
            checked={props.dataCompleted !== null}
          />
          <View onClick={this.triggerClick} style={styles.textDisplay}>
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
          </View>
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
          // TODO: fix this
          // the code will never get executed because this goes to null
          // the moment there's a force touch
          // wish there was an event in react-beatiful-dnd or something?
          this.draggingStart = snapshot.draggingOver !== null
          return (
            <View
              ref={this.viewRef}
              style={styles.transitionStyle}
              className={props.dataType === 'task' ? 'hover-5' : null}
            >
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={getItemStyle(
                  snapshot.isDragging,
                  provided.draggableProps.style
                )}
              >
                {innerItem}
              </div>
            </View>
          )
        }}
      </Draggable>
    )
  }
}
const styles = StyleSheet.create({
  wrapper: {
    paddingTop: vars.padding * 0.1875,
    paddingBottom: vars.padding * 0.1875,
    paddingLeft: vars.padding / 4,
    paddingRight: vars.padding / 2,
    flex: 1,
    flexDirection: 'row',
    cursor: 'default'
  },
  wrapperPadding: {
    marginTop: vars.padding * 0.25,
    marginBottom: vars.padding * 0.375
  },
  textDisplay: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: vars.padding / 4
  },
  textRow: {
    flex: 1
  },
  frontIcon: {
    width: 24,
    height: 24,
    marginRight: vars.padding * 0.375
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
    borderRadius: isDragging ? 3 : 0,

    // change background colour if dragging
    background: isDragging ? vars.dragColor : '',

    // styles we need to apply on draggables
    ...draggableStyle
  }
  return style
}
