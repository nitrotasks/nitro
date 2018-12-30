import React from 'react'
import { bool, func, string } from 'prop-types'
import { Text, StyleSheet } from 'react-native'

import { vars } from '../../styles.js'
import { TouchableOpacity } from './touchableOpacity.jsx'

export class Button extends React.Component {
  static propTypes = {
    onPress: func.isRequired,
    disabled: bool,
    color: string,
    textColor: string,
    borderColor: string,
    title: string.isRequired
  }
  render() {
    const {
      onPress,
      title,
      color,
      textColor,
      borderColor,
      disabled
    } = this.props
    return (
      <TouchableOpacity
        onClick={onPress}
        style={[
          styles.button,
          color && { backgroundColor: color },
          borderColor && {
            borderColor: borderColor
          },
          disabled && styles.buttonDisabled
        ]}
      >
        <Text
          style={[
            styles.text,
            textColor && { color: textColor },
            disabled && styles.buttonDisabled
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    )
  }
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#000',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'transparent',
    borderStyle: 'solid'
  },
  buttonDisabled: {
    backgroundColor: '#dfdfdf'
  },
  text: {
    color: '#fff',
    fontFamily: vars.fontFamily,
    fontWeight: '600',
    padding: 8,
    textAlign: 'center',
    fontSize: 15
  },
  textDisabled: {
    color: '#a1a1a1'
  }
})
