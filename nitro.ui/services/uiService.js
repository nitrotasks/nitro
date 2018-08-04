import { Events } from '../../nitro.sdk'
import { iOS } from '../helpers/ios.js'

class uiService extends Events {
  constructor(props) {
    super(props)
  }
  state = {
    scrollPosition: 0,

    // root card positions
    oldCardPosition: 'map',
    cardPosition: 'map',

    // used for proper touch rejection
    headerEvent: null
  }

  setCardPosition(position, animate = true, manual = false) {
    // don't need to do anything if it's already in the right position
    if (this.state.cardPosition === position) {
      return
    }
    if (position === 'toggle') {
      if (this.state.cardPosition === 'default') {
        position = 'map'
      } else if (this.state.cardPosition === 'max') {
        position = 'default'
      } else if (this.state.cardPosition === 'map') {
        position = 'default'
      }
    }
    this.state.cardPosition = position
    this.trigger('card-position', position, animate, manual)
    if (animate === true) {
      setTimeout(() => {
        this.state.oldCardPosition = position
      }, 200)
    } else {
      this.state.oldCardPosition = position
    }
  }
}

export let UiService = new uiService()
