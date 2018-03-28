import preact from 'preact'

import DialogBoxStore from '../stores/dialogbox.js'

const stateDefaults = {
  show: false,
  header: 'Confirm Action',
  content: 'Are you sure you want to do this?',
  context: '',
  type: 'confirmation',
  confirm: 'Confirm',
  cancel: 'Cancel',
  callback: () => {}
}

export default class DialogBox extends preact.Component {
  constructor(props) {
    super(props)
    this.state = Object.assign({}, stateDefaults)
    this.callback = stateDefaults.callback
  }
  componentWillMount() {
    DialogBoxStore.bind('create', this.create)
  }
  componentWillUnmount() {
    DialogBoxStore.unbind('create', this.create)
  }
  create = params => {
    this.setState({
      header: params.header || stateDefaults.header,
      content: params.content || stateDefaults.content,
      context: params.context || stateDefaults.context,
      confirm: params.confirm || stateDefaults.confirm,
      cancel: params.cancel || stateDefaults.cancel,
      type: params.type || stateDefaults.type,
      show: true
    })
    this.callback = params.callback || stateDefaults.callback

    if (this.state.type === 'input') {
      setTimeout(() => {
        this.input.focus()
      }, 250)
    }

    document.addEventListener('keyup', this.keyup)
  }
  triggerHide = (override = false) => {
    return e => {
      if (override || e.target === e.currentTarget) {
        this.setState({
          show: false
        })

        document.removeEventListener('keyup', this.keyup)
      }
    }
  }
  triggerCallback = () => {
    if (this.state.type === 'input') {
      const val = this.input.value
      if (val.trim().length === 0) {
        return
      } else {
        this.callback(val)
      }
    } else {
      this.callback()
    }
    this.setState({
      show: false
    })

    document.removeEventListener('keyup', this.keyup)
  }
  keyup = e => {
    if (e.keyCode === 27) {
      this.triggerHide(true)()
    } else if (e.keyCode === 13) {
      this.triggerCallback()
    }
  }
  render() {
    let mainClass = 'dialogbox-wrap'
    if (!this.state.show) {
      mainClass += ' hide'
    }
    let content = this.state.content
    if (this.state.type === 'input') {
      content = (
        <div>
          <label htmlFor="dialogbox-input">{this.state.content}</label>
          <input type="text" id="dialogbox-input" ref={e => {this.input = e}}/>
        </div>
      )
    }
    return (
      <div class={mainClass} onClick={this.triggerHide()}>
        <div class={'dialogbox ' + this.state.context + ' ' + this.state.type + 'box'}>
          <header>{this.state.header}</header>
          <div class="content">{content}</div>
          <div class="button-box">
            <button class="cancel" onClick={this.triggerHide(true)}>
              {this.state.cancel}
            </button>
            <button class="confirm" onClick={this.triggerCallback}>
              {this.state.confirm}
            </button>
          </div>
        </div>
      </div>
    )
  }
}
