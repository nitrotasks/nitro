import { NitroSdk, Events } from '../../nitro.sdk'

class _modalService extends Events {
  constructor(props) {
    super(props)
    NitroSdk.bind('show-tutorial', this.showTutorial)
  }
  show = (options, confirmAction) => {
    this.trigger('show', {
      confirmAction: confirmAction,
      confirmText: options.confirmText,
      confirmColor: options.confirmColor,
      cancelText: options.cancelText,
      message: options.message
    })
  }
  showShortcuts = () => {
    this.trigger('show-shortcuts')
  }
  showTutorial = () => {
    this.trigger('show-tutorial')
    console.log('Show Tutorial!')
  }
}
let ModalService = new _modalService()
export { ModalService }
