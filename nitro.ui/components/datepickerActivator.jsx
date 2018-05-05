import React from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity } from 'react-native'

import { DatepickerService } from '../services/datepickerService.js'

export class DatepickerActivator extends React.Component {
  static propTypes = {
    callback: PropTypes.func,
    date: PropTypes.instanceOf(Date),
    type: PropTypes.string,
    children: PropTypes.element,
    style: PropTypes.number
  }
  triggerPress = () => {
    DatepickerService.activate(this.props.pickerId, {
      callback: this.props.onSelect,
      date: this.props.date,
      type: this.props.pickerType
    })
  }
  render() {
    return (
      <TouchableOpacity onPress={this.triggerPress} style={this.props.style}>
        {this.props.children}
      </TouchableOpacity>
    )
  }
}
