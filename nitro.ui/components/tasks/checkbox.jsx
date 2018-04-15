import React from 'react'
import { View, StyleSheet } from 'react-native'

import { vars } from '../../styles.js'

export const Checkbox = function(props) {
  const boxStyles = props.checked ? [styles.box, styles.boxChecked] : styles.box
  return (
    <View style={styles.check} onClick={props.onClick}>
      <View style={boxStyles} />
    </View>
  )
}
const styles = StyleSheet.create({
  check: {
    width: 1.875 * vars.padding,
    paddingTop: vars.padding / 2,
    paddingBottom: vars.padding / 2,
    display: 'flex'
  },
  box: {
    marginTop: 'auto',
    marginBottom: 'auto',
    width: vars.padding * 1.25,
    height: vars.padding * 1.25,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: '12px'
  },
  boxChecked: {
    backgroundColor: vars.boxColor,
    borderColor: vars.boxColor
  }
})
