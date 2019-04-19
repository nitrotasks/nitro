import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { vars } from '../styles.js'

const MENU_ITEM_HEIGHT = 42
export const ContextMenuItem = ({ onClick, title }) => {
  const [hover, setHover] = useState(false)
  return (
    <View
      style={hover ? [styles.menuItemHover, styles.menuItem] : styles.menuItem}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Text style={styles.menuText}>{title}</Text>
    </View>
  )
}
const styles = StyleSheet.create({
  menuItem: {
    paddingLeft: vars.padding,
    paddingRight: vars.padding,
    cursor: 'default',
    userSelect: 'none'
  },
  menuText: {
    fontFamily: vars.fontFamily,
    fontSize: 15,
    color: '#222',
    lineHeight: MENU_ITEM_HEIGHT
  },
  menuItemHover: {
    backgroundColor: 'rgba(0,0,0,0.05)'
  }
})
