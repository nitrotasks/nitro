import React from 'react'
import PropTypes from 'prop-types'
import { View, Image, TouchableWithoutFeedback, StyleSheet } from 'react-native'

import checkIcon from '../../../assets/icons/feather/check.svg'
import { vars } from '../../styles.js'

export class Checkbox extends React.PureComponent {
  static propTypes = {
    onPress: PropTypes.func
  }
  state = {
    active: false
  }
  triggerPressIn = () => {
    this.setState({ active: true })
  }
  triggerPressOut = () => {
    this.setState({ active: false })
  }
  render() {
    const props = this.props
    let boxStyles = styles.box
    if (this.state.active) {
      boxStyles = [styles.box, styles.boxChecked, styles.boxActive]
    } else if (props.checked) {
      boxStyles = [styles.box, styles.boxChecked]
    }
    return (
      <TouchableWithoutFeedback 
        onPress={props.onPress}
        onPressIn={this.triggerPressIn}
        onPressOut={this.triggerPressOut}
      >
        <View style={styles.check} >
          <View style={boxStyles}>
            <Image
              accessibilityLabel="Tick Mark"
              source={checkIcon}
              resizeMode="contain"
              style={styles.boxIcon}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}
const styles = StyleSheet.create({
  check: {
    width: 2 * vars.padding,
    paddingTop: vars.padding / 2,
    paddingBottom: vars.padding / 2,
    display: 'flex'
  },
  box: {
    marginTop: 2,
    width: vars.padding * 1.375,
    height: vars.padding * 1.375,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: '12px',
    transitionDuration: '50ms',
    transitionTimingFunction: 'ease-in',
    transitionProperty: 'transform'
  },
  boxChecked: {
    backgroundColor: vars.boxColor,
    borderColor: vars.boxColor
  },
  boxActive: {
    transform: [{ scale: 0.9 }],
    backgroundColor: vars.boxColorDark,
    borderColor: vars.boxColorDark
  },
  boxIcon: {
    height: 24
  }
})
