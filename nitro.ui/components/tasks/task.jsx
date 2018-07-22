import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, Image, StyleSheet, findNodeHandle } from 'react-native'
import { Draggable } from 'react-beautiful-dnd'

import { NitroSdk } from '../../../nitro.sdk'
import { vars } from '../../styles.js'
import { formatDate } from '../../helpers/date.js'
import { TasksExpandedService } from '../../services/tasksExpandedService.js'
import { Checkbox } from './checkbox.jsx'
import { TaskHeader } from './taskHeader.jsx'

import todayIcon from '../../../assets/icons/feather/today.svg'
import notesIcon from '../../../assets/icons/material/note.svg'

// this is the threshold defined in react-beautiful-dnd
const forcePressTheshold = 0.15

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
    selected: PropTypes.bool,
    selectedHeight: PropTypes.number,
    selectedCallback: PropTypes.func,
    headersAllowed: PropTypes.bool,
    dragDisabled: PropTypes.bool
  }
  thresholdHit = false
  constructor(props) {
    super(props)
    this.viewRef = React.createRef()
  }
  componentDidMount() {
    this.triggerPosition()

    if ('ontouchforcechange' in document === true) {
      findNodeHandle(this.viewRef.current).addEventListener(
        'touchforcechange',
        this.triggerForcePress
      )
    }
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
        this.props.dataId,
        scrollby
      )
    })
  }
  // iOS has a funnny force press / 3d touch API
  // i.e it doesn't use pointer events
  // and raises these events at same time
  triggerForcePress = e => {
    const force = e.changedTouches[0].force
    if (
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
      if (props.dataDeadline !== null) {
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
        <View style={wrapperStyles}>
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
        draggableId={props.dataId}
        index={props.index}
        isDragDisabled={props.dragDisabled}
      >
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
              {innerItem}
            </div>
          </View>
        )}
      </Draggable>
    )
  }
}
const styles = StyleSheet.create({
  wrapper: {
    paddingTop: vars.padding * 0.1875,
    paddingBottom: vars.padding * 0.1875,
    paddingLeft: vars.padding / 2,
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
    alignItems: 'center'
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
