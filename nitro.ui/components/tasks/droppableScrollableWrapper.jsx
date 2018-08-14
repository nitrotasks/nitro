import React from 'react'
import PropTypes from 'prop-types'
import { Droppable } from 'react-beautiful-dnd'

import { UiService } from '../../services/uiService.js'
import { iOS } from '../../helpers/ios.js'

export class DroppableScrollableWrapper extends React.Component {
  static propTypes = {
    children: PropTypes.node
  }
  scrollView = React.createRef()
  innerScrollView = null

  componentDidMount() {
    UiService.scrollView = this.scrollView

    if (iOS.detect()) {
      this.scrollView.current.addEventListener(
        'touchstart',
        this.scrollViewTouchStart
      )
      this.innerScrollView.style.minHeight = '101%'
    }
  }
  scrollViewTouchStart = e => {
    iOS.triggerStart(e)
  }
  render() {
    const props = this.props
    return (
      <Droppable droppableId="tasksList">
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
                position: 'relative'
              }}
            >
              <div
                ref={e => {
                  provided.innerRef(e)
                  this.innerScrollView = e
                }}
              >
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
