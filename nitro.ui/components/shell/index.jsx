import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, withRouter } from 'react-router-dom'
import { View } from 'react-native'

import { iOS } from '../../helpers/ios.js'
import { TasksExpandedService } from '../../services/tasksExpandedService.js'
import { UiService } from '../../services/uiService.js'
import { Lists } from '../lists/index.jsx'
import { Tasks } from '../tasks/index.jsx'
import { Logs } from '../logs.jsx'

const paddingHeight = 25
const barHeight = 66
const animationSpeed = 250

const topOffset = 0
const maxPosition = 0
const defaultPosition = 300
// const minPosition = 0 // not used

class ShellComponent extends React.Component {
  static propTypes = {
    location: PropTypes.object,
    history: PropTypes.object
  }
  state = {
    animate: false,
    showPin: false,
    cardPosition: UiService.state.cardPosition,
    delayCard: false
  }
  constructor(props) {
    super(props)
    this.Search = null // Map Component, dynamic load

    if (iOS.detect()) {
      document.body.classList.add('ios')
    }

    const resize = () => {
      let heightStr = document.documentElement.clientHeight + 'px'
      if (iOS.detect() && window.navigator.standalone) {
        heightStr = `calc(${heightStr} - var(--bottom-inset))`
      }
      document.body.style.setProperty('--real-height', heightStr)
    }
    resize()
    window.onresize = () => {
      requestAnimationFrame(resize)
    }

    this.touchstartpos = null // actual start pos
    this.fakestartpos = null // used for non janky animations
    this.touchlastpos = null // used to detect flick
    this.scrolllock = false // used so you know the difference between scroll & transform

    this.touchLock = false
  }
  componentDidMount() {
    UiService.bind('card-position', this.handleNewCardPosition)
    this.touchcard.addEventListener('touchstart', this.triggerTouchStart)
    this.touchcard.addEventListener('touchend', this.triggerTouchEnd)
    this.touchcard.addEventListener('touchcancel', this.triggerTouchEnd)

    if (iOS.detect()) {
      this.touchcard.addEventListener('touchmove', this.triggerTouchMove, {
        passive: false
      })
    } else {
      this.touchcard.addEventListener('touchmove', this.triggerTouchMove, {
        passive: true
      })
    }
  }
  handleNewCardPosition = (position, animate, manual) => {
    const newState = {
      cardPosition: position
    }
    if (
      UiService.state.oldCardPosition === 'default' &&
      position === 'max' &&
      animate === true &&
      manual === false
    ) {
      newState.delayCard = true
    } else {
      newState.delayCard = false
    }
    // can still be set to initial at this point
    // we run this to ensure that the animation runs
    this.touchcard.style.transition = ''
    this.setState(newState)
  }
  togglePin = () => {
    this.setState({
      showPin: !this.state.showPin
    })
  }
  toggleStations = (newPosition = 'toggle') => {
    requestAnimationFrame(() => {
      UiService.setCardPosition(newPosition, false)
    })
  }
  getSnapAnchor(pos) {
    // well you could definitely refactor it for less lines
    // but then you would be very confused what would be happening
    if (this.state.cardPosition === 'max') {
      const defaultThreshold = this.clientHeight - defaultPosition
      const defaultUpperThreshold = defaultThreshold / 2
      const defaultLowerThreshold =
        defaultThreshold + defaultPosition / 2 - barHeight
      if (pos < defaultUpperThreshold) {
        return 'max'
      } else if (pos > defaultLowerThreshold) {
        return 'map'
      } else {
        return 'default'
      }
    } else if (this.state.cardPosition === 'default') {
      // there's a negative and positive bit,
      // because there's a swipe up (negative)
      // and swipe down from the middle default position
      const defaultUpperThreshold = (defaultPosition / 2) * -1
      const defaultLowerThreshold = defaultPosition / 2
      if (pos < defaultUpperThreshold) {
        return 'max'
      } else if (pos > defaultLowerThreshold) {
        return 'map'
      } else {
        return 'default'
      }
    } else if (this.state.cardPosition === 'map') {
      // as this is when we start snapped from the bottom,
      // it does my brain in less if we just use positive numbers
      pos = Math.abs(pos)
      const defaultThreshold = defaultPosition - barHeight
      const defaultUpperThreshold = defaultThreshold / 2
      const defaultLowerThreshold =
        defaultThreshold + defaultPosition / 2 - barHeight
      if (pos < defaultUpperThreshold) {
        return 'map'
      } else if (pos > defaultLowerThreshold) {
        return 'max'
      } else {
        return 'default'
      }
    }
  }
  getFlickAnchor(pos) {
    if (this.state.cardPosition === 'default') {
      // need to detect if they flick up or down
      return pos > 0 ? 'max' : 'map'
    } else if (
      this.state.cardPosition === 'map' &&
      Math.abs(pos) > defaultPosition
    ) {
      // if they flick up extra far
      return 'max'
    } else if (
      this.state.cardPosition === 'max' &&
      Math.abs(pos) > this.clientHeight - defaultPosition
    ) {
      // if they flick down extra far
      return 'map'
    }
    return 'default'
  }
  triggerTouchStart = e => {
    // only start the pull down if they're at the top of the card
    if (this.touchLock === true) {
      return
    }
    if (
      (UiService.state.scrollPosition === 0 ||
        e.target === UiService.state.headerEvent ||
        this.state.cardPosition === 'default') &&
      window.innerWidth < 851
    ) {
      this.ioskillscroll = false
      this.touchstartpos = e.touches[0].clientY
      this.fakestartpos = e.touches[0].clientY
      this.touchlastpos = e.touches[0].clientY

      this.scrolllock = null
      this.clientHeight = document.documentElement.clientHeight
      this.windowHeight = this.clientHeight / 2
      this.cardHeight =
        e.currentTarget.offsetHeight - maxPosition - barHeight - paddingHeight

      this.scrollingOnBar =
        iOS.detect() && e.target === UiService.state.headerEvent

      // kill transition
      this.touchcard.style.transition = 'initial'

      // hack to detect flicks
      this.longtouch = false
      setTimeout(() => {
        this.longtouch = true
      }, animationSpeed)
    } else if (iOS.detect() && UiService.state.scrollPosition < 0) {
      this.ioskillscroll = true
    } else {
      this.ioskillscroll = false
      this.touchstartpos = null
      this.fakestartpos = null
      this.longtouch = null
      this.scrolllock = null
    }
  }
  triggerTouchMove = e => {
    // cancels if they're not at the top of the card
    if (this.touchstartpos === null || this.touchLock === true) {
      return
    }
    if (this.scrollingOnBar) {
      e.preventDefault()
    }
    if (this.ioskillscroll === true) {
      e.preventDefault()
      return
    }
    e.stopPropagation()

    // todo animate between first touchstart & touchmove
    const scrollLogic = () => {
      if (this.scrolllock === true) {
        let offset = e.changedTouches[0].clientY - this.fakestartpos
        let lowerLimit = 0
        let upperLimit = this.cardHeight
        if (this.state.cardPosition === 'map') {
          offset = offset + this.cardHeight - barHeight / 2 + paddingHeight
          upperLimit = this.cardHeight + maxPosition
        } else if (this.state.cardPosition === 'default') {
          offset =
            offset +
            this.cardHeight -
            defaultPosition +
            paddingHeight +
            topOffset
        }

        // limits from scrolling over start or end
        if (offset < lowerLimit) {
          offset = lowerLimit
        } else if (offset > upperLimit) {
          offset = upperLimit
        }

        // stores last touch position for use on touchend to detect flick
        this.touchlastpos = e.changedTouches[0].clientY

        const cardtransform = `translate3d(0,${offset}px,0)`
        requestAnimationFrame(() => {
          this.touchcard.style.transform = cardtransform
        })
        if (iOS.detect()) {
          e.preventDefault()
        }
        return true
      } else if (this.scrolllock === false) {
        // scrolling enabled, do nothing
        return true
      }
    }
    // return if it executes
    if (scrollLogic() === true) {
      return
    }

    // TODO: This needs to be fixed cause it's messing up the scrolling.
    // does the equality depending on state of card
    let newPos = e.changedTouches[0].clientY
    let equality = false
    if (this.state.cardPosition === 'map') {
      equality = this.touchstartpos < newPos
      // this is like scrolling up on the bar - stops the scroll on body in iOS
      if (equality && iOS.detect()) {
        e.preventDefault()
      }
    } else if (this.state.cardPosition === 'max') {
      equality = this.touchstartpos > newPos
    }

    if (equality === false) {
      this.scrolllock = true

      // eliminiate the janky feel
      this.fakestartpos = newPos + (this.state.cardPosition === 'map' ? -1 : 1)
      scrollLogic()
    } else {
      this.scrolllock = false
    }
  }
  triggerTouchEnd = e => {
    // cancels if the event never started
    if (
      this.touchstartpos === null ||
      this.scrolllock === false ||
      this.touchLock === true
    ) {
      return
    }

    // detects if they've scrolled over halfway
    if (this.longtouch === true) {
      // hacks to make it not slow on slow device
      const touchDelta = e.changedTouches[0].clientY - this.touchstartpos
      const newSnap = this.getSnapAnchor(touchDelta)
      if (newSnap !== this.state.cardPosition) {
        this.rootcontainer.className = `root-container ${newSnap}-view`
        setTimeout(() => {
          this.toggleStations(newSnap)
        }, animationSpeed)
      }
      // detects a flick
    } else if (
      this.longtouch === false &&
      Math.abs(this.touchstartpos - this.touchlastpos) > 15
    ) {
      // hacks to make it not slow on slow devices
      const touchDelta = this.touchstartpos - this.touchlastpos
      const newSnap = this.getFlickAnchor(touchDelta)
      // special easing curve
      requestAnimationFrame(() => {
        this.rootcontainer.className = `root-container ${newSnap}-view`
        this.touchLock = true
        this.touchcard.style.transition = `${animationSpeed}ms ease-out transform`
        this.touchcard.style.transform = ''
      })
      setTimeout(() => {
        this.toggleStations(newSnap)
        requestAnimationFrame(() => {
          this.touchcard.style.transition = ''
        })
        this.touchLock = false
      }, animationSpeed + 25)
      return
    }
    requestAnimationFrame(() => {
      this.touchcard.style.transition = ''
      this.touchcard.style.transform = ''
    })
  }
  triggerPaddingButton(e) {
    UiService.state.headerEvent = e.target
  }
  triggerRootContainer = e => {
    if (
      (this.state.cardPosition === 'default' ||
        this.state.cardPosition === 'max') &&
      e.target === this.rootcontainer
    ) {
      UiService.setCardPosition('map')
    }
  }
  render() {
    const rootClassName =
      'root-container ' +
      this.state.cardPosition +
      '-view' +
      (this.state.delayCard ? ' delay-transition' : '')

    return (
      <React.Fragment>
        <div
          className={rootClassName}
          ref={e => (this.rootcontainer = e)}
          onClick={this.triggerRootContainer}
        >
          <div className="root-map">
            <Switch>
              <Route
                path="/logs"
                render={routeProps => <Logs {...routeProps} />}
              />
              <Route
                path="/:list/:task?"
                render={routeProps => {
                  TasksExpandedService.routeUpdate(routeProps)
                  return <Tasks {...routeProps} />
                }}
              />
            </Switch>
          </div>
          <div
            className="root-card enable-scrolling"
            ref={e => (this.touchcard = e)}
          >
            <div
              className="root-card-padding-button"
              onTouchStart={this.triggerPaddingButton}
            />
            <View className="root-card-wrapper">
              <Lists />
            </View>
          </div>
        </div>
      </React.Fragment>
    )
  }
}
const Shell = withRouter(ShellComponent)
export { Shell }
