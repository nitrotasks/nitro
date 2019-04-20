import React, { useState, forwardRef } from 'react'
import { View, StyleSheet } from 'react-native'

export const TouchableOpacity = forwardRef(
  ({ children, activeOpacity, style, ...other }, ref) => {
    const [active, setActive] = useState(false)

    const elementStyles = [style]
    if (active && activeOpacity === undefined) elementStyles.push(styles.active)
    else if (active && activeOpacity === 25) elementStyles.push(styles.active25)
    else if (active && activeOpacity === 75) elementStyles.push(styles.active75)
    else if (active && activeOpacity === 90) elementStyles.push(styles.active90)

    return (
      <View
        {...other}
        ref={ref}
        style={elementStyles}
        onMouseDown={() => setActive(true)}
        onMouseUp={() => setActive(false)}
        onTouchStart={() => setActive(true)}
        onTouchCancel={() => setActive(false)}
        onTouchEnd={() => setActive(false)}
      >
        {children}
      </View>
    )
  }
)
const styles = StyleSheet.create({
  active: {
    opacity: 0.5
  },
  active25: {
    opacity: 0.25
  },
  active75: {
    opacity: 0.75
  },
  active90: {
    opacity: 0.9
  }
})
