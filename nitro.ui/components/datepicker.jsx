import React from 'react'
import { View, StyleSheet } from 'react-native'
import DayPicker from 'react-day-picker'

import { vars } from '../styles.js'
import { formatDate } from '../helpers/date.js'

import duedateSvg from '../../assets/icons/material/task-duedate.svg'
import deadlineSvg from '../../assets/icons/material/task-deadline.svg'

export class Datepicker extends React.Component {
  state = {
    visible: false
  }
  triggerSelect = value1 => {
    return value2 => {
      let value = value1 || value2
      this.props.onSelect(value)
      this.triggerHide()
    }
  }
  removeDate = e => {
    e.stopPropagation()
    this.props.onSelect(null)
  }
  triggerVisible = () => {
    this.setState({
      visible: true
    })
  }
  triggerHide = () => {
    this.setState({
      visible: false
    })
  }
  render() {
    // TODO: abstract this to translation library
    const pickerType = this.props.pickerType || 'date'
    let titleText = 'Pick Date'
    let buttonText = 'Date'
    let buttonsTop
    if (pickerType === 'deadline') {
      titleText = 'Set Deadline'
      buttonText = 'Deadline'
    }
    if (pickerType === 'date' || pickerType === 'deadline') {
      buttonsTop = (
        <div className="button-list">
          <button className="today" onClick={this.triggerSelect('today')}>
            Today
          </button>
          <button className="tomorrow" onClick={this.triggerSelect('tomorrow')}>
            Tomorrow
          </button>
          <button className="nextweek" onClick={this.triggerSelect('nextweek')}>
            Next Week
          </button>
        </div>
      )
    }

    const bodyStyle = this.state.visible
      ? [styles.wrapper]
      : [styles.wrapper, styles.wrapperHidden]
    let activator = null
    if (
      this.props.position === 'sheet' ||
      this.props.position === 'sheet-hidden'
    ) {
      bodyStyle.push(styles.wrapperFloating)
      bodyStyle.push(styles.wrapperSheet)
      if (this.props.position === 'sheet-hidden') {
        bodyStyle.push({ display: 'none' })
      }

      activator = (
        <button onClick={this.triggerVisible}>
          {this.props.type} {formatDate(this.props.date) || buttonText}
        </button>
      )
    } else if (this.props.position === 'popover') {
      bodyStyle.push(styles.wrapperFloating)
      bodyStyle.push(styles.wrapperPopover)
      let imgSrc
      if (pickerType === 'deadline') {
        imgSrc = deadlineSvg
      } else {
        imgSrc = duedateSvg
      }
      // ensures we don't get a rogue 'next' value
      const next = pickerType === 'deadline' ? 'task' : this.props.type
      activator = (
        <div onClick={this.triggerVisible}>
          <img src={imgSrc} />
          {formatDate(this.props.date, next) || buttonText}
          <button onClick={this.removeDate}>X</button>
        </div>
      )
    }

    return (
      <div className="datepicker-element">
        {activator}
        <View style={bodyStyle}>
          <View style={styles.container}>
            <header>
              <h3>{titleText}</h3>
              <button
                className="close"
                onClick={this.triggerHide}
                title="Close"
              />
            </header>
            {buttonsTop}
            <DayPicker />
          </View>
        </View>
      </div>
    )
  }
}
const styles = {
  wrapper: {
    top: 0,
    left: 0,
    transitionDuration: '200ms',
    transitionProperty: 'opacity',
    transitionTimingFunction: 'ease'
  },
  wrapperFloating: {
    position: 'fixed'
  },
  wrapperSheet: {
    background: 'rgba(0,0,0,0.2)',
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
    paddingLeft: vars.padding / 2,
    paddingRight: vars.padding / 2,
    paddingBottom: vars.padding * 0.75,
    boxShadow: '0 -1px 2px rgba(0,0,0,0.2)'
  }
}
