import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'

import { formatDate } from '../helpers/date.js'
import { DatepickerService } from '../services/datepickerService.js'

export class DatepickerActivator extends React.Component {
  static propTypes = {
    callback: PropTypes.func,
    date: PropTypes.instanceOf(Date),
    type: PropTypes.string
  }
  triggerPress = () => {
    DatepickerService.activate(this.props.pickerId, {
      callback: this.props.onSelect,
      date: this.props.date,
      type: this.props.pickerType
    })
  }
  render() {
    let buttonText = 'Choose Date'
    if (this.props.pickerType === 'deadline') {
      buttonText = 'Choose Deadline'
    }
    return (
      <TouchableOpacity onPress={this.triggerPress}>
        <Text>{formatDate(this.props.date) || buttonText}</Text>
      </TouchableOpacity>
    )
  }
}
