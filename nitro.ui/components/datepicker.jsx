import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import DayPicker from 'react-day-picker'

import { vars } from '../styles.js'
import { DatepickerService } from '../services/datepickerService.js'

import closeIcon from '../../assets/icons/material/close.svg'
import todayIcon from '../../assets/icons/feather/today.svg'
import tomorrowIcon from '../../assets/icons/feather/tomorrow.svg'
import nextIcon from '../../assets/icons/feather/next.svg'

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
      if (value.constructor === Date) {
        value.setHours(0)
        value.setMinutes(0)
        value.setSeconds(0)
        value.setMilliseconds(0)
      }
      this.callback(value)
      this.triggerHide()
    }
  }
  triggerHide = () => {
    this.setState({
      visible: false
    })
  }
  triggerOverlayHide = e => {
    if (e.target === e.currentTarget) {
      this.triggerHide()
    }
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
            style={styles.quickButton}
            onClick={this.triggerSelect('today')}
          >
            <Image
              accessibilityLabel="Today Icon"
              source={todayIcon}
              resizeMode="contain"
              style={styles.quickButtonImage}
            />
            <Text style={styles.quickButtonText}>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickButton}
            onClick={this.triggerSelect('tomorrow')}
          >
            <Image
              accessibilityLabel="Tomorrow Icon"
              source={tomorrowIcon}
              resizeMode="contain"
              style={styles.quickButtonImage}
            />
            <Text style={styles.quickButtonText}>Tomorrow</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickButton}
            onClick={this.triggerSelect('nextweek')}
          >
            <Image
              accessibilityLabel="Next Week Icon"
              source={nextIcon}
              resizeMode="contain"
              style={styles.quickButtonImage}
            />
            <Text style={styles.quickButtonText}>Next Week</Text>
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
      <View
        className="desktop-datepicker"
        style={bodyStyle}
        pointerEvents={bodyPointerEvents}
        onClick={this.triggerOverlayHide}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>{titleText}</Text>
            <TouchableOpacity onClick={this.triggerHide}>
              <Image
                accessibilityLabel="Close Datepicker"
                source={closeIcon}
                resizeMode="contain"
                style={styles.closeIcon}
              />
            </TouchableOpacity>
          </View>
          {buttonsTop}
          <View style={styles.daypickerWrapper}>
            <DayPicker
              firstDayOfWeek={1}
              selectedDays={this.state.date}
              onDayClick={this.triggerSelect()}
              month={this.state.date}
            />
          </View>
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
    position: 'fixed',
    touchAction: 'none',
    zIndex: 20
  },
  wrapperSheet: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    height: 'var(--real-height)',
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
    paddingLeft: vars.padding / 2,
    paddingRight: vars.padding / 2,
    paddingBottom: vars.padding / 2,
    boxShadow: '0 -1px 2px rgba(0,0,0,0.2)'
  },
  header: {
    flex: 1,
    flexDirection: 'row'
  },
  headerText: {
    flex: 1,
    fontWeight: '900',
    textTransform: 'uppercase',
    fontFamily: vars.fontFamily,
    fontSize: vars.padding * 1.125,
    paddingTop: vars.padding,
    paddingBottom: vars.padding * 0.5,
    paddingLeft: vars.padding * 0.25
  },
  closeIcon: {
    height: 24,
    width: 24,
    marginTop: vars.padding * 0.75
  },
  quickButton: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: vars.padding * 0.25,
    paddingBottom: vars.padding * 0.375,
    paddingLeft: vars.padding * 0.25,
    paddingRight: vars.padding * 0.25
  },
  quickButtonImage: {
    height: 24,
    width: 24,
    marginTop: vars.padding / 4,
    marginRight: vars.padding * 0.625
  },
  quickButtonText: {
    flex: 1,
    lineHeight: vars.padding * 2,
    fontFamily: vars.fontFamily,
    fontSize: vars.padding * 1.125,
    fontWeight: '600'
  },
  daypickerWrapper: {
    paddingLeft: vars.padding / 2,
    paddingRight: vars.padding / 2
  }
})
