import preact from 'preact'

import ContextMenuStore from '../stores/contextmenu.js'

export default class ContextMenu extends preact.Component {
  constructor(props) {
    super(props)
    this.state = {
      x: 0,
      y: 0,
      show: false,
      items: []
    }
  }
  componentWillMount() {
    ContextMenuStore.bind('create', this.createMenu)
  }
  componentWillUnmount() {
    ContextMenuStore.unbind('create', this.createMenu)
  }
  createMenu = params => {
    const [x, y, anchor, secondAnchor, items] = params
    const newState = {}
    if (anchor === 'top') {
      newState.y = y
    }
    if (secondAnchor === 'left') {
      newState.x = x
    } else if (secondAnchor === 'right') {
      newState.x = (window.innerWidth - x) * -1
    }
    newState.show = true
    newState.items = items
    this.setState(newState)
  }
  triggerHide = e => {
    e.preventDefault()
    this.setState({
      show: false
    })
  }
  render() {
    let mainClass = 'contextmenu-wrap'
    if (!this.state.show) {
      mainClass += ' hide'
    }
    const style = {
      top: this.state.y,
    }
    if (this.state.x > 0) {
      style.left = this.state.x
    } else {
      style.right = Math.abs(this.state.x)
    }
    return (
      <div class={mainClass} onClick={this.triggerHide} onContextMenu={this.triggerHide}>
        <ul class="contextmenu" style={style}>
          {this.state.items.map((item, key) => {
            return <li key={key} onClick={item.action}>{item.title}</li>
          })}
        </ul>
      </div>
    )
  }
}