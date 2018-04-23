import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import DayPicker from 'react-day-picker'

import { vars } from '../styles.js'
import { DatepickerService } from '../services/datepickerService.js'

export class Datepicker extends React.Component {
  static propTypes = {
    pickerId: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired
  }
  state = {
    visible: false,
    type: 'date'
  }
  callback = () => {}
  componentDidMount() {
    DatepickerService.bind('activate', this.triggerActivate)
  }
  componentWillUnmount() {
    DatepickerService.unbind('activate', this.triggerActivate)
  }
  triggerActivate = (pickerId, props) => {
    if (pickerId === this.props.pickerId) {
      this.callback = props.callback
      this.setState({
        visible: true,
        date: props.date,
        type: props.type
      })
    }
  }
  triggerSelect = value1 => {
    return value2 => {
      let value = value1 || value2
      this.callback(value)
      this.triggerHide()
    }
  }
  triggerHide = () => {
    this.setState({
      visible: false
    })
  }
  render() {
    // TODO: abstract this to translation library
    const pickerType = this.state.type
    let titleText = 'Pick Date'
    let buttonsTop
    if (pickerType === 'deadline') {
      titleText = 'Set Deadline'
    }
    if (pickerType === 'date' || pickerType === 'deadline') {
      buttonsTop = (
        <View>
          <TouchableOpacity
            style={[styles.quickButton, styles.todayButton]}
            onClick={this.triggerSelect('today')}
          >
            <Text>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickButton, styles.tomorrowButton]}
            onClick={this.triggerSelect('tomorrow')}
          >
            <Text>Tomorrow</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickButton, styles.nextButton]}
            onClick={this.triggerSelect('nextweek')}
          >
            <Text>Next Week</Text>
          </TouchableOpacity>
        </View>
      )
    }

    let bodyStyle = [styles.wrapper]
    let bodyPointerEvents = 'auto'
    if (!this.state.visible) {
      bodyStyle.push({ opacity: 0 })
      bodyPointerEvents = 'none'
    }
    if (
      this.props.position === 'sheet' ||
      this.props.position === 'sheet-hidden'
    ) {
      bodyStyle.push(styles.wrapperFloating)
      bodyStyle.push(styles.wrapperSheet)
      if (this.props.position === 'sheet-hidden') {
        bodyStyle.push({ display: 'none' })
      }
    } else if (this.props.position === 'popover') {
      bodyStyle.push(styles.wrapperFloating)
      bodyStyle.push(styles.wrapperPopover)
    }

    return (
      <View style={bodyStyle} pointerEvents={bodyPointerEvents}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>{titleText}</Text>
            <button
              className="close"
              onClick={this.triggerHide}
              title="Close"
            />
          </View>
          {buttonsTop}
          <DayPicker />
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  wrapper: {
    top: 0,
    left: 0,
    transitionDuration: '200ms',
    transitionProperty: 'opacity',
    transitionTimingFunction: 'ease'
  },
  wrapperFloating: {
    position: 'absolute',
    zIndex: 20
  },
  wrapperSheet: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    height: '100vh',
    width: '100%',
    flexDirection: 'row'
  },
  wrapperPopover: {
    zIndex: 2
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 0,
    transitionDuration: '200ms',
    transitionProperty: 'transform',
    paddingLeft: vars.padding,
    paddingRight: vars.padding,
    paddingBottom: vars.padding * 0.75,
    boxShadow: '0 -1px 2px rgba(0,0,0,0.2)'
  },
  header: {
    flex: 1,
    flexDirection: 'row'
  },
  headerText: {
    fontWeight: '900',
    textTransform: 'uppercase',
    fontSize: vars.padding,
    paddingTop: vars.padding * 0.75,
    paddingBottom: vars.padding * 0.25
  },
  quickButton: {
    paddingTop: vars.padding * 0.25,
    paddingBottom: vars.padding * 0.25,
    paddingLeft: vars.padding * 0.25,
    paddingRight: vars.padding * 0.25
  },
  todayButton: {},
  tomorrowButton: {},
  nextButton: {}
})
