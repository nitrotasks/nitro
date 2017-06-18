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
    console.log(params)
    const [x, y, anchor, secondAnchor, items] = params
    const newState = {}
    if (anchor === 'top') {
      newState.y = y
    }
    if (secondAnchor === 'left') {
      newState.x = x
    }
    newState.show = true
    newState.items = items
    this.setState(newState)
  }
  triggerHide = () => {
    this.setState({
      show: false
    })
  }
  render() {
    let mainClass = 'contextmenu-wrap'
    if (!this.state.show) {
      mainClass += ' hide'
    }
    return (
      <div class={mainClass} onClick={this.triggerHide}>
        <ul class="contextmenu" style={{
          top: this.state.x,
          left: this.state.y,
        }}>
          {this.state.items.map((item, key) => {
            return <li key={key} onClick={item.action}>{item.title}</li>
          })}
        </ul>
      </div>
    )
  }
}