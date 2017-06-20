import preact from 'preact'

import DialogBoxStore from '../stores/dialogbox.js'

const stateDefaults = {
  show: false,
  header: 'Confirm Action',
  content: 'Are you sure you want to do this?',
  context: '',
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
      show: true
    })
    this.callback = params.callback || stateDefaults.callback
  }
  triggerHide = (override = false) => {
    return e => {
      if (override || e.target === e.currentTarget) {
        this.setState({
          show: false
        })
      }
    }
  }
  triggerCallback = () => {
    this.setState({
      show: false
    })
    this.callback()
  }
  render() {
    let mainClass = 'dialogbox-wrap'
    if (!this.state.show) {
      mainClass += ' hide'
    }
    return (
      <div class={mainClass} onClick={this.triggerHide()}>
        <div class={'dialogbox ' + this.state.context}>
          <header>{this.state.header}</header>
          <div class="content">{this.state.content}</div>
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
