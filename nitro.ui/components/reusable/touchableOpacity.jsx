import React from 'react'
import { View, findNodeHandle } from 'react-native-web'

import { UiStore } from '../../stores/uiStore.js'
import { iOS } from '../../helpers/ios.js'

// # README
// The whole reason this stupid component exists is because iOS has a flicker problem.
// I thought it was an opacity 1 -> opacity 0.x. And the fix is 0.99 -> whatever in test.
// Unfortunately that solution doesn't work in Waka. And it's really hard to figure out why.
// Instead of finding out why, I just wrote this hack.
// It uses webkit-tap-highlight-color, except when it's at the top of the card.
// Otherwise when the card undergoes a transform, the tap color remains on the screen.
// So it uses active. There's no flickering in this scenario.
// Lots of the code only runs on iOS because yeah, it's not required for most browsers.
// Check _react_native.scss for the corresponding CSS (can't do :active in JS without like, state)
export class TouchableOpacity extends React.Component {
  constructor(props) {
    super(props)
    if (
      iOS.detect() &&
      (props.iOSHacks === true || this.props.touchAction === 'none')
    ) {
      this.viewRef = React.createRef()
      this.classList = null
    }
  }
  componentDidMount() {
    if (iOS.detect() && this.props.touchAction === 'none') {
      const node = findNodeHandle(this.viewRef.current)
      node.addEventListener('touchmove', this.touchNone, { passive: false })
    }
  }
  componentWillUnmount() {
    if (iOS.detect() && this.props.touchAction === 'none') {
      const node = findNodeHandle(this.viewRef.current)
      node.removeEventListener('touchmove', this.touchNone, { passive: false })
    }
  }
  touchStart = () => {
    if (UiStore.state.scrollPosition === 0) {
      this.classList = findNodeHandle(this.viewRef.current).classList
      this.classList.add('touchable-opacity-active')
    }
  }
  touchEnd = () => {
    if (this.classList) {
      this.classList.remove('touchable-opacity-active')
    }
  }
  touchNone = e => {
    e.preventDefault()
    e.stopPropagation()
  }
  render() {
    const {
      children,
      className,
      iOSHacks,
      touchAction,
      activeOpacity,
      ...other
    } = this.props

    if (iOS.detect()) {
      other.ref = this.viewRef
    }

    const newClassName =
      (className || '') +
      (activeOpacity === 75 ? ' opacity-75' : '') +
      (activeOpacity === 90 ? ' opacity-90' : '') +
      ' touchable-opacity'
    if (iOS.detect() && iOSHacks === true) {
      return (
        <View
          className={newClassName}
          {...other}
          onTouchStart={this.touchStart}
          onTouchCancel={this.touchEnd}
          onTouchEnd={this.touchEnd}
        >
          {children}
        </View>
      )
    } else {
      return (
        <View className={newClassName + ' touchable-opacity-active'} {...other}>
          {children}
        </View>
      )
    }
  }
}
