import React from 'react'
import PropTypes from 'prop-types'
import { ScrollView as ScrollViewNative, StyleSheet } from 'react-native'

import { iOS } from '../../helpers/ios.js'

// This component links the scroll to the fancy shell.
export class ScrollView extends React.Component {
  static propTypes = {
    children: PropTypes.node
  }
  constructor(props) {
    super(props)
    this.scrollView = React.createRef()
  }
  componentDidMount() {
    if (iOS.detect()) {
      const node = this.scrollView.current.getScrollableNode()
      node.addEventListener('touchstart', this.scrollViewTouchStart)
      node.children[0].style.minHeight = '101%'
    }
  }
  componentWillUnmount() {
    if (iOS.detect()) {
      this.scrollView.current
        .getScrollableNode()
        .removeEventListener('touchstart', this.scrollViewTouchStart)
    }
  }
  scrollViewTouchStart = e => {
    iOS.triggerStart(e, 'top')
  }
  render() {
    return (
      <ScrollViewNative
        style={styles.scroll}
        scrollEventThrottle={16}
        ref={this.scrollView}
      >
        {this.props.children}
      </ScrollViewNative>
    )
  }
}
const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    // this property doesn't quiite work? maybe it's a bug in android chrome
    overscrollBehavior: 'contain',
    willChange: 'scroll'
  }
})
