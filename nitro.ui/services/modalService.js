import { Events } from '../../nitro.sdk'

class _modalService extends Events {
  show(options, confirmAction) {
    this.trigger('show', {
      confirmAction: confirmAction,
      confirmText: options.confirmText,
      confirmColor: options.confirmColor,
      cancelText: options.cancelText,
      message: options.message
    })
  }
}
let ModalService = new _modalService()
export { ModalService }
