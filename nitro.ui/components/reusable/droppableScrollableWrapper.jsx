import React from 'react'
import PropTypes from 'prop-types'
import { Droppable } from 'react-beautiful-dnd'

import { UiService } from '../../services/uiService.js'
import { iOS } from '../../helpers/ios.js'

export class DroppableScrollableWrapper extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    children: PropTypes.node,
    linked: PropTypes.bool
  }
  scrollView = React.createRef()
  intersectHelper = React.createRef()
  innerScrollView = null
  state = {
    cardPosition: UiService.state.cardPosition,
    cancelScroll: true
  }
  componentDidMount() {
    // todo: i realize this gives us a max of two scrollview in the app
    // will fix later
    if (this.props.linked === true) {
      UiService.bind('card-position', this.cardPositionCallback)

      this.observer = new IntersectionObserver(this.triggerIntersect, {
        root: this.scrollView.current,
        rootMargin: '0px',
        threshold: 0
      })
      this.observer.observe(this.intersectHelper.current)
    } else {
      UiService.scrollView = this.scrollView
    }

    if (iOS.detect()) {
      this.scrollView.current.addEventListener(
        'touchstart',
        this.scrollViewTouchStart
      )
      this.innerScrollView.style.minHeight = '101%'
    }
  }
  componentWillUnmount() {
    if (this.props.linked === true) {
      UiService.state.scrollPosition = 0
      UiService.unbind('card-position', this.cardPositionCallback)
      this.observer.disconnect()
    }
  }
  cardPositionCallback = position => {
    if (this.state.cardPosition !== position) {
      this.setState({ cardPosition: position })
    }
  }
  scrollViewTouchStart = e => {
    if (this.props.linked === true) {
      iOS.triggerStart(e, 'bottom')
    } else {
      iOS.triggerStart(e)
    }
  }
  triggerIntersect = e => {
    const isIntersecting = e[0].isIntersecting
    if (isIntersecting !== this.state.cancelScroll) {
      this.setState({ cancelScroll: isIntersecting })
    }
    UiService.state.scrollPosition = isIntersecting ? 0 : 1
  }
  render() {
    const props = this.props

    // wow this ternary operator is a bit crazy
    const touchAction =
      props.linked === true
        ? UiService.state.cardPosition === 'max'
          ? this.state.cancelScroll
            ? iOS.detect()
              ? 'manipulation' // one day iOS will get support
              : 'pan-down'
            : 'manipulation'
          : 'none'
        : 'manipulation'
    return (
      <Droppable droppableId={this.props.id}>
        {provided => {
          return (
            <div
              ref={this.scrollView}
              style={{
                height: '100%',
                overflowY: 'auto',
                overscrollBehavior: 'contain',
                willChange: 'scroll-position',
                WebkitOverflowScrolling: 'touch',
                position: 'relative',
                touchAction: touchAction
              }}
            >
              <div
                ref={e => {
                  provided.innerRef(e)
                  this.innerScrollView = e
                }}
              >
                <div ref={this.intersectHelper} />
                {props.children}
                {provided.placeholder}
              </div>
            </div>
          )
        }}
      </Droppable>
    )
  }
}
